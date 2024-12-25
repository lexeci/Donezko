import { PrismaService } from '@/src/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccessStatus, OrgRole } from '@prisma/client';
import {
	ChangeTaskAssigneeDto,
	ChangeTaskTeamDto,
	CreateTaskDto,
	GetTaskCommentDto,
	ManageTaskDto,
	TaskCommentDto,
	UpdateTaskDto
} from './dto/task.dto';

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Private function to check the user's access to the organization, project, and team.
	 * Ensures that the user has the required permissions to access the given resources.
	 *
	 * @param {Object} params - The parameters for permission checks.
	 * @param {string} params.userId - The ID of the user to check.
	 * @param {string} [params.projectId] - Optional project ID for project-level access check.
	 * @param {string} [params.teamId] - Optional team ID for team-level access check.
	 * @param {string} params.organizationId - The organization ID to check access against.
	 */
	private async checkUserPermission({
		userId,
		projectId,
		teamId,
		organizationId
	}: {
		userId: string;
		projectId?: string;
		teamId?: string;
		organizationId: string;
	}) {
		if (!organizationId) {
			throw new ForbiddenException('Organization ID is required.');
		}

		// Check if the user is a member of the organization.
		const orgUser = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});
		if (!orgUser) {
			throw new ForbiddenException(
				'You are not a member of this organization.'
			);
		}

		// If the user is banned, throw an error.
		if (orgUser.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('You are banned in this organization.');
		}

		// If the user is an admin or owner, skip the checks.
		if (([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(orgUser.role))
			return;

		// If a project ID is provided, check if the user is part of the project.
		if (projectId) {
			const projectUser = await this.prisma.projectUser.findFirst({
				where: { userId, projectId }
			});
			if (!projectUser || projectUser.projectStatus !== AccessStatus.ACTIVE) {
				throw new ForbiddenException('You do not have access to this project.');
			}
		}

		// If a team ID is provided, check if the user is part of the team.
		if (teamId) {
			const teamUser = await this.prisma.teamUser.findFirst({
				where: { userId, teamId }
			});
			if (!teamUser || teamUser.teamStatus !== AccessStatus.ACTIVE) {
				throw new ForbiddenException('You do not have access to this team.');
			}
		}
	}

	/** ===================== TASK OPERATIONS ===================== */

	/**
	 * Retrieves all tasks assigned to a specific user.
	 *
	 * @param {string} userId - The ID of the user to retrieve tasks for.
	 * @returns {Promise<Task[]>} A list of tasks assigned to the user.
	 */
	async getAll({
		organizationId,
		userId,
		projectId,
		teamId,
		available
	}: {
		organizationId: string;
		userId: string;
		projectId: string;
		teamId: string;
		available: string;
	}) {
		if (!projectId) {
			throw new ForbiddenException(
				'You must have access to any project before proceed.'
			);
		}

		// Шукаємо користувача в організації
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		// Якщо користувач не є частиною організації, кидаємо помилку
		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		// Якщо користувач заблокований в організації, кидаємо помилку
		if (currentUserInOrg.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Insufficient permissions');
		}

		// Перевірка, чи має користувач роль OWNER або ADMIN
		const isPermitted = ([OrgRole.OWNER, OrgRole.ADMIN] as OrgRole[]).includes(
			currentUserInOrg.role
		);

		if (!isPermitted) {
			// Check if the user has access to the project
			const projectUser = await this.prisma.projectUser.findUnique({
				where: { projectId_userId: { projectId, userId } }
			});
			if (!projectUser || projectUser.projectStatus !== AccessStatus.ACTIVE) {
				throw new ForbiddenException('You do not have access to this project.');
			}

			if (teamId) {
				const teamUser = await this.prisma.teamUser.findUnique({
					where: { userId_teamId: { teamId, userId } }
				});
				if (!teamUser || teamUser.teamStatus !== AccessStatus.ACTIVE) {
					throw new ForbiddenException('You do not have access to this team.');
				}
			}
		}

		return this.prisma.task.findMany({
			where: {
				projectId,
				...(teamId && { teamId }),
				...(available && { userId })
			}
		});
	}

	/**
	 * Creates a new task.
	 *
	 * @param {CreateTaskDto} dto - The DTO containing the task details to create.
	 * @param {string} userId - The ID of the user creating the task.
	 * @returns {Promise<Task>} The newly created task.
	 */
	async create({ dto, userId }: { dto: CreateTaskDto; userId: string }) {
		const { projectId, teamId, organizationId, ...restDto } = dto;

		if (!projectId || !teamId || !organizationId) {
			throw new ForbiddenException(
				'Project ID, Team ID, and Organization ID are required.'
			);
		}

		// Check user permissions for the given project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId,
			teamId,
			organizationId
		});

		return this.prisma.task.create({
			data: {
				...restDto,
				user: { connect: { id: userId } },
				project: { connect: { id: projectId } },
				team: { connect: { id: teamId } }
			}
		});
	}

	/**
	 * Updates an existing task.
	 *
	 * @param {Partial<UpdateTaskDto>} dto - The DTO containing the fields to update.
	 * @param {string} id - The ID of the task to update.
	 * @param {string} userId - The ID of the user requesting the update.
	 * @returns {Promise<Task>} The updated task.
	 */
	async update({
		dto,
		id,
		userId
	}: {
		dto: Partial<UpdateTaskDto>;
		id: string;
		userId: string;
	}) {
		const { projectId, teamId, organizationId } = dto;

		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		// Check user permissions for the given task, project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId,
			teamId,
			organizationId
		});

		return this.prisma.task.update({ where: { id }, data: dto });
	}

	/**
	 * Deletes a task.
	 *
	 * @param {string} id - The ID of the task to delete.
	 * @param {ManageTaskDto} dto - The DTO containing the details required for the deletion.
	 * @param {string} userId - The ID of the user requesting the deletion.
	 * @returns {Promise<Task>} The deleted task.
	 */
	async delete({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ManageTaskDto;
		userId: string;
	}) {
		const { organizationId, projectId, teamId } = dto;

		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		// Check user permissions for the given task, project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId,
			teamId,
			organizationId
		});

		return this.prisma.task.delete({ where: { id } });
	}

	/**
	 * Change the assignee of a task.
	 *
	 * @param {string} id - The ID of the task to change the assignee for.
	 * @param {ChangeTaskAssigneeDto} dto - The DTO containing the new assignee's details.
	 * @param {string} userId - The ID of the user requesting the change.
	 * @returns {Promise<Task>} The updated task with the new assignee.
	 */
	async changeAssignee({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ChangeTaskAssigneeDto;
		userId: string;
	}) {
		const { organizationId, taskUserId } = dto;

		if (!taskUserId) {
			throw new ForbiddenException('Task assignee ID is required.');
		}

		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) throw new ForbiddenException('Task not found.');

		// Check user permissions for the task, project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		const assignee = await this.prisma.user.findUnique({
			where: { id: taskUserId }
		});
		if (!assignee) {
			throw new ForbiddenException('The specified user does not exist.');
		}

		return this.prisma.task.update({
			where: { id },
			data: { userId: taskUserId }
		});
	}

	/**
	 * Transfer a task to a different team.
	 *
	 * @param {string} id - The ID of the task to transfer.
	 * @param {ChangeTaskTeamDto} dto - The DTO containing the target team ID.
	 * @param {string} userId - The ID of the user requesting the transfer.
	 * @returns {Promise<Task>} The updated task with the new team.
	 */
	async transferTaskToTeam({
		id,
		dto,
		userId
	}: {
		id: string;
		dto: ChangeTaskTeamDto;
		userId: string;
	}) {
		const { organizationId, teamId } = dto;

		if (!teamId) {
			throw new ForbiddenException('Team ID is required to transfer the task.');
		}

		const task = await this.prisma.task.findUnique({
			where: { id },
			include: { project: true, team: true }
		});
		if (!task) throw new ForbiddenException('Task not found.');

		const newTeam = await this.prisma.team.findUnique({
			where: { id: teamId }
		});
		if (!newTeam) {
			throw new ForbiddenException('The specified team does not exist.');
		}

		// Ensure that the team belongs to the same project as the task.
		if (newTeam.projectId !== task.projectId) {
			throw new ForbiddenException(
				'The specified team does not belong to the same project as the task.'
			);
		}

		// Check user permissions for the task, project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		return this.prisma.task.update({
			where: { id },
			data: { teamId: teamId }
		});
	}

	/** ===================== COMMENT OPERATIONS ===================== */

	/**
	 * Add a comment to a task.
	 *
	 * @param {string} id - The ID of the task to comment on.
	 * @param {string} userId - The ID of the user adding the comment.
	 * @param {TaskCommentDto} dto - The DTO containing the comment content and organization details.
	 * @returns {Promise<Comment>} The newly added comment.
	 */
	async addCommentToTask({
		id,
		userId,
		dto
	}: {
		id: string;
		userId: string;
		dto: TaskCommentDto;
	}) {
		const { organizationId, content } = dto;

		if (!content || !organizationId) {
			throw new ForbiddenException('Content and Organization ID are required.');
		}

		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		// Check user permissions for the task, project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		return this.prisma.comment.create({
			data: { content, userId, taskId: id }
		});
	}

	/**
	 * Retrieve all comments for a specific task.
	 *
	 * @param {string} userId - The ID of the user requesting the comments.
	 * @param {string} id - The ID of the task to retrieve comments for.
	 * @param {GetTaskCommentDto} dto - The DTO containing the organization ID filter.
	 * @returns {Promise<Comment[]>} A list of comments for the specified task.
	 */
	async getCommentsForTask({
		userId,
		id,
		dto
	}: {
		userId: string;
		id: string;
		dto: GetTaskCommentDto;
	}) {
		const { organizationId } = dto;

		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		// Check user permissions for the task, project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		return this.prisma.comment.findMany({
			where: { taskId: id },
			include: {
				user: { select: { id: true, name: true, email: true } }
			},
			orderBy: { createdAt: 'asc' }
		});
	}

	/**
	 * Delete a comment from a task.
	 *
	 * @param {string} id - The ID of the task the comment belongs to.
	 * @param {string} commentId - The ID of the comment to delete.
	 * @param {GetTaskCommentDto} dto - The DTO containing the organization details.
	 * @param {string} userId - The ID of the user requesting the deletion.
	 * @returns {Promise<Comment>} The deleted comment.
	 */
	async deleteComment({
		id,
		commentId,
		dto,
		userId
	}: {
		id: string;
		commentId: string;
		dto: GetTaskCommentDto;
		userId: string;
	}) {
		const { organizationId } = dto;

		// Find the comment to delete.
		const comment = await this.prisma.comment.findUnique({
			where: { id: commentId }
		});
		if (!comment) {
			throw new ForbiddenException('Comment not found.');
		}

		// Ensure the user is deleting their own comment.
		if (comment.userId !== userId) {
			throw new ForbiddenException('You can only delete your own comments.');
		}

		// Check that the comment belongs to the correct task.
		const task = await this.prisma.task.findUnique({
			where: { id: comment.taskId }
		});
		if (!task || task.id !== id) {
			throw new ForbiddenException(
				'The comment does not belong to the specified task.'
			);
		}

		// Check user permissions for the task, project, team, and organization.
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		return this.prisma.comment.delete({ where: { id: commentId } });
	}
}
