import { PrismaService } from '@/src/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccessStatus, OrgRole, ProjectRole } from '@prisma/client';
import {
	ChangeTaskAssigneeDto,
	ChangeTaskTeamDto,
	CreateTaskDto,
	ManageTaskDto,
	TaskCommentDto,
	UpdateTaskDto
} from './dto/task.dto';

/**
 * TaskService - Service class for managing tasks.
 *
 * This class contains methods for interacting with tasks, including creating, updating,
 * assigning, removing, and managing task details. It uses PrismaService to interact with the database.
 */
@Injectable()
export class TaskService {
	/**
	 * Creates an instance of the TaskService.
	 *
	 * This constructor injects the PrismaService, which is used for accessing the database.
	 *
	 * @param prisma - An instance of the PrismaService.
	 *
	 * @example
	 * const taskService = new TaskService(prismaServiceInstance);
	 * // Creates a new TaskService instance with the PrismaService injected.
	 */
	constructor(private prisma: PrismaService) {}

	/**
	 * Retrieves all tasks assigned to a specific user.
	 *
	 * This method retrieves tasks based on the provided parameters such as the user's ID,
	 * the organization, project, team, and availability status. It ensures the user has the
	 * necessary access to the project and organization before returning the tasks.
	 *
	 * @param {string} organizationId - The ID of the organization to which the user belongs.
	 * @param {string} userId - The ID of the user to retrieve tasks for.
	 * @param {string} projectId - The ID of the project to filter tasks by.
	 * @param {string} teamId - The ID of the team to filter tasks by (optional).
	 * @param {string} available - A flag indicating whether to filter tasks assigned to the user (optional).
	 *
	 * @returns {Promise<Task[]>} A list of tasks assigned to the user, including details such as:
	 * - Team title
	 * - Author name
	 * - Assignee name
	 * - Project title
	 * - The count of task comments
	 *
	 * @throws {ForbiddenException} If the user does not have the necessary permissions to access the tasks.
	 * @throws {ForbiddenException} If the user is not part of the organization or is banned from it.
	 * @throws {ForbiddenException} If the user does not have access to the specified project.
	 *
	 * @example
	 * // Retrieve tasks for a user in a project
	 * const tasks = await taskService.getAll({
	 *   organizationId: 'org1',
	 *   userId: 'user1',
	 *   projectId: 'project1',
	 *   teamId: 'team1',
	 *   available: 'true'
	 * });
	 * // Returns tasks assigned to 'user1' in 'project1', filtered by 'team1' and availability.
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
		// Check if the user has access to the project
		if (!projectId) {
			throw new ForbiddenException(
				'You must have access to any project before proceeding.'
			);
		}

		// Find the user in the organization
		const currentUserInOrg = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		// If the user is not part of the organization, throw an error
		if (!currentUserInOrg) {
			throw new ForbiddenException('You are not part of this organization');
		}

		// If the user is banned from the organization, throw an error
		if (currentUserInOrg.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Insufficient permissions');
		}

		// Check if the user has OWNER or ADMIN role
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
		}

		// Return the list of tasks based on the filters
		return this.prisma.task.findMany({
			where: {
				projectId,
				...(teamId && { teamId }),
				...(available && { userId })
			},
			include: {
				team: {
					select: {
						title: true
					}
				},
				author: {
					select: {
						name: true
					}
				},
				user: {
					select: {
						name: true
					}
				},
				project: {
					select: {
						title: true
					}
				},
				_count: {
					select: {
						comments: true
					}
				}
			}
		});
	}

	/**
	 * Creates a new task.
	 *
	 * This method handles the creation of a new task. It first verifies that all required fields,
	 * such as Project ID, Team ID, and Organization ID, are provided. Then, it checks if the user has
	 * the necessary permissions to create the task within the given project, team, and organization.
	 * After the checks pass, a new task is created and returned.
	 *
	 * @param {CreateTaskDto} dto - The DTO containing the task details to create. It includes:
	 * - projectId: The ID of the project the task belongs to.
	 * - teamId: The ID of the team assigned to the task.
	 * - organizationId: The ID of the organization where the task is created.
	 * - userId: The ID of the user to be assigned the task (optional).
	 * - title: The title of the task.
	 * - description: A detailed description of the task.
	 *
	 * @param {string} userId - The ID of the user creating the task. This user is set as the task's author.
	 *
	 * @returns {Promise<Task>} The newly created task, including all details such as:
	 * - project ID
	 * - team ID
	 * - assigned user ID (if provided)
	 * - author (user creating the task)
	 *
	 * @throws {ForbiddenException} If the Project ID, Team ID, or Organization ID is missing or invalid.
	 * @throws {ForbiddenException} If the user doesn't have permission to create the task in the specified project, team, or organization.
	 *
	 * @example
	 * // Create a new task with the given details
	 * const task = await taskService.create({
	 *   dto: {
	 *     projectId: 'project1',
	 *     teamId: 'team1',
	 *     organizationId: 'org1',
	 *     userId: 'user2',
	 *     title: 'Complete task documentation',
	 *     description: 'Write and review documentation for the task service.'
	 *   },
	 *   userId: 'user1'
	 * });
	 * // Returns the newly created task with project, team, and author details
	 */
	async create({ dto, userId }: { dto: CreateTaskDto; userId: string }) {
		const {
			projectId,
			teamId,
			organizationId,
			userId: assigneeId,
			...restDto
		} = dto;

		// Ensure the required fields are provided
		if (!projectId || !teamId || !organizationId) {
			throw new ForbiddenException(
				'Project ID, Team ID, and Organization ID are required.'
			);
		}

		// Check user permissions for the given project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId,
			teamId,
			organizationId
		});

		// Create and return the task
		return this.prisma.task.create({
			data: {
				...restDto,
				...(assigneeId && { user: { connect: { id: assigneeId } } }),
				author: { connect: { id: userId } },
				project: { connect: { id: projectId } },
				team: { connect: { id: teamId } }
			},
			include: {
				team: {
					select: {
						title: true
					}
				},
				author: {
					select: {
						name: true
					}
				},
				user: {
					select: {
						name: true
					}
				},
				project: {
					select: {
						title: true
					}
				},
				_count: {
					select: {
						comments: true
					}
				}
			}
		});
	}

	/**
	 * Updates an existing task.
	 *
	 * This method handles updating a task's properties. It first ensures the task exists in the database.
	 * If the task is found, the user permissions are verified to ensure the user has the right to update
	 * the task within the specified project, team, and organization. After the permissions check, the task
	 * is updated with the provided fields.
	 *
	 * @param {Partial<UpdateTaskDto>} dto - The DTO containing the fields to update. It includes:
	 * - projectId: The ID of the project to which the task belongs.
	 * - teamId: The ID of the team assigned to the task.
	 * - organizationId: The ID of the organization the task belongs to.
	 * - title: The updated title of the task (optional).
	 * - description: The updated description of the task (optional).
	 * - isCompleted: The updated status of the task (optional).
	 *
	 * @param {string} id - The ID of the task to update.
	 *
	 * @param {string} userId - The ID of the user requesting the update. This user must have permission
	 * to update the task.
	 *
	 * @returns {Promise<Task>} The updated task with the new properties.
	 *
	 * @throws {ForbiddenException} If the task cannot be found.
	 * @throws {ForbiddenException} If the user does not have permission to update the task in the specified project, team, or organization.
	 *
	 * @example
	 * // Update an existing task with the given details
	 * const updatedTask = await taskService.update({
	 *   dto: {
	 *     projectId: 'project1',
	 *     teamId: 'team1',
	 *     organizationId: 'org1',
	 *     title: 'Updated Task Title',
	 *     description: 'Updated task description'
	 *   },
	 *   id: 'task1',
	 *   userId: 'user1'
	 * });
	 * // Returns the updated task with the new details
	 */
	async update({
		dto,
		id,
		userId,
		organizationId
	}: {
		dto: Partial<UpdateTaskDto>;
		id: string;
		userId: string;
		organizationId: string;
	}) {
		const { projectId, teamId, organizationId: dtoOrgId, ...data } = dto;

		// Fetch the task from the database
		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		if (dtoOrgId !== organizationId) {
			throw new ForbiddenException(
				`Hmmm, something strange happened there...\n`
			);
		}

		// Check user permissions for the task's project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId,
			teamId,
			organizationId
		});

		// Update the task in the database
		return this.prisma.task.update({ where: { id }, data });
	}

	/**
	 * Deletes a task.
	 *
	 * This method handles the deletion of a task. It first checks if the task exists in the database.
	 * If the task is found, the user permissions are verified to ensure the user has the right to delete
	 * the task within the specified project, team, and organization. After the permissions check, the task
	 * is deleted from the database.
	 *
	 * @param {string} id - The ID of the task to delete.
	 *
	 * @param {ManageTaskDto} dto - The DTO containing the details required for the deletion, including:
	 * - organizationId: The ID of the organization the task belongs to.
	 * - projectId: The ID of the project the task belongs to.
	 * - teamId: The ID of the team the task belongs to.
	 *
	 * @param {string} userId - The ID of the user requesting the deletion. This user must have permission
	 * to delete the task.
	 *
	 * @returns {Promise<Task>} The deleted task.
	 *
	 * @throws {ForbiddenException} If the task cannot be found.
	 * @throws {ForbiddenException} If the user does not have permission to delete the task in the specified project, team, or organization.
	 *
	 * @example
	 * // Delete a task with the given ID and details
	 * const deletedTask = await taskService.delete({
	 *   id: 'task1',
	 *   dto: {
	 *     organizationId: 'org1',
	 *     projectId: 'project1',
	 *     teamId: 'team1'
	 *   },
	 *   userId: 'user1'
	 * });
	 * // Returns the deleted task
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

		// Fetch the task from the database
		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		// Check user permissions for the task's project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId,
			teamId,
			organizationId
		});

		// Delete the task from the database
		return this.prisma.task.delete({ where: { id } });
	}

	/**
	 * Change the assignee of a task.
	 *
	 * This method updates the assignee of a given task. It first checks if the task exists and validates
	 * the existence of the new assignee. Then, it checks the permissions of the user requesting the change
	 * to ensure they have the right to modify the task within the specified project, team, and organization.
	 * After validation, the task is updated with the new assignee's ID.
	 *
	 * @param {string} id - The ID of the task to change the assignee for.
	 *
	 * @param {ChangeTaskAssigneeDto} dto - The DTO containing the new assignee's details, including:
	 * - organizationId: The ID of the organization the task belongs to.
	 * - taskUserId: The ID of the new user to assign the task to.
	 *
	 * @param {string} userId - The ID of the user requesting the change. This user must have permission
	 * to change the task's assignee.
	 *
	 * @returns {Promise<Task>} The updated task with the new assignee.
	 *
	 * @throws {ForbiddenException} If the task cannot be found.
	 * @throws {ForbiddenException} If the user does not have permission to change the assignee for the task.
	 * @throws {ForbiddenException} If the specified assignee does not exist.
	 *
	 * @example
	 * // Change the assignee of a task to a new user
	 * const updatedTask = await taskService.changeAssignee({
	 *   id: 'task1',
	 *   dto: {
	 *     organizationId: 'org1',
	 *     taskUserId: 'user2'
	 *   },
	 *   userId: 'user1'
	 * });
	 * // Returns the updated task with user2 as the new assignee
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

		// Check if the assignee is provided
		if (!taskUserId) {
			throw new ForbiddenException('Task assignee ID is required.');
		}

		// Fetch the task from the database
		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) throw new ForbiddenException('Task not found.');

		// Check user permissions for the task's project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		// Validate if the specified assignee exists
		const assignee = await this.prisma.user.findUnique({
			where: { id: taskUserId }
		});
		if (!assignee) {
			throw new ForbiddenException('The specified user does not exist.');
		}

		// Update the task with the new assignee
		return this.prisma.task.update({
			where: { id },
			data: { userId: taskUserId }
		});
	}

	/**
	 * Transfer a task to a different team.
	 *
	 * This method moves a task from one team to another within the same project. It first checks if the task exists
	 * and if the target team is valid and belongs to the same project as the task. Then, it verifies the user's permissions
	 * to ensure they have the right to modify the task and its team. Once validated, the task is updated to belong to the new team.
	 *
	 * @param {string} id - The ID of the task to transfer.
	 *
	 * @param {ChangeTaskTeamDto} dto - The DTO containing the target team's details, including:
	 * - organizationId: The ID of the organization the task belongs to.
	 * - teamId: The ID of the new team to assign the task to.
	 *
	 * @param {string} userId - The ID of the user requesting the transfer. This user must have permission
	 * to transfer the task to another team within the project and organization.
	 *
	 * @returns {Promise<Task>} The updated task with the new team.
	 *
	 * @throws {ForbiddenException} If the task cannot be found.
	 * @throws {ForbiddenException} If the target team does not exist.
	 * @throws {ForbiddenException} If the target team does not belong to the same project as the task.
	 * @throws {ForbiddenException} If the user does not have permission to transfer the task.
	 *
	 * @example
	 * // Transfer a task to a new team within the same project
	 * const updatedTask = await taskService.transferTaskToTeam({
	 *   id: 'task1',
	 *   dto: {
	 *     organizationId: 'org1',
	 *     teamId: 'team2'
	 *   },
	 *   userId: 'user1'
	 * });
	 * // Returns the updated task with team2 as the new team
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

		// Ensure the target team ID is provided
		if (!teamId) {
			throw new ForbiddenException('Team ID is required to transfer the task.');
		}

		// Fetch the task and its project and team details
		const task = await this.prisma.task.findUnique({
			where: { id },
			include: { project: true, team: true }
		});
		if (!task) throw new ForbiddenException('Task not found.');

		// Check if the target team exists
		const newTeam = await this.prisma.team.findUnique({
			where: { id: teamId }
		});
		if (!newTeam) {
			throw new ForbiddenException('The specified team does not exist.');
		}

		// Ensure the team belongs to the same project as the task
		if (newTeam.projectId !== task.projectId) {
			throw new ForbiddenException(
				'The specified team does not belong to the same project as the task.'
			);
		}

		// Check user permissions for the task, project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		// Update the task with the new team
		return this.prisma.task.update({
			where: { id },
			data: { teamId: teamId }
		});
	}

	/**
	 * Add a comment to a task.
	 *
	 * This method allows a user to add a comment to an existing task. It checks if the task exists, verifies that
	 * the user has the required permissions, and ensures that the content and organization ID are provided in the DTO.
	 * Once validated, a new comment is created and linked to the specified task.
	 *
	 * @param {string} id - The ID of the task to comment on.
	 * @param {string} userId - The ID of the user adding the comment. This user must have permission to add comments
	 * to the task in the specified project and organization.
	 * @param {TaskCommentDto} dto - The DTO containing the comment content and organization details:
	 * - organizationId: The ID of the organization the task belongs to.
	 * - content: The content of the comment to be added.
	 *
	 * @returns {Promise<Comment>} The newly added comment, including the user's details (ID, name, email).
	 *
	 * @throws {ForbiddenException} If content or organization ID is missing.
	 * @throws {ForbiddenException} If the task cannot be found.
	 * @throws {ForbiddenException} If the user does not have permission to add a comment to the task.
	 *
	 * @example
	 * // Add a comment to a task
	 * const newComment = await taskService.addCommentToTask({
	 *   id: 'task1',
	 *   userId: 'user1',
	 *   dto: {
	 *     organizationId: 'org1',
	 *     content: 'This is a comment on the task.'
	 *   }
	 * });
	 * // Returns the newly added comment with user details
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

		// Ensure content and organization ID are provided
		if (!content || !organizationId) {
			throw new ForbiddenException('Content and Organization ID are required.');
		}

		// Find the task by ID
		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		// Check user permissions for the task, project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		// Create and return the new comment
		return this.prisma.comment.create({
			data: { content, userId, taskId: id },
			include: {
				user: { select: { id: true, name: true, email: true } }
			}
		});
	}

	/**
	 * Retrieve all comments for a specific task.
	 *
	 * This method fetches all comments associated with a particular task. It checks if the task exists,
	 * and verifies that the user has permission to access comments related to the task in the specified project and organization.
	 * The comments are returned in ascending order by their creation date.
	 *
	 * @param {string} userId - The ID of the user requesting the comments. The user must have permission to access comments
	 * for the specified task in the project and organization.
	 * @param {string} id - The ID of the task to retrieve comments for.
	 * @param {string} organizationId - The ID of the organization to which the task belongs. This is used to verify user access.
	 *
	 * @returns {Promise<Comment[]>} A list of comments for the specified task, including user details (ID, name, email).
	 *
	 * @throws {ForbiddenException} If the task cannot be found.
	 * @throws {ForbiddenException} If the user does not have permission to view comments for the task.
	 *
	 * @example
	 * // Retrieve all comments for a task
	 * const comments = await taskService.getCommentsForTask({
	 *   userId: 'user1',
	 *   id: 'task1',
	 *   organizationId: 'org1'
	 * });
	 * // Returns an array of comments for the task, ordered by creation date
	 */
	async getCommentsForTask({
		userId,
		id,
		organizationId
	}: {
		userId: string;
		id: string;
		organizationId: string;
	}) {
		const task = await this.prisma.task.findUnique({ where: { id } });
		if (!task) {
			throw new ForbiddenException('Task not found.');
		}

		// Check user permissions for the task, project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		// Retrieve and return comments for the task
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
	 * This method allows a user to delete their own comment from a task. It ensures that the user
	 * requesting the deletion is the author of the comment and verifies that the comment belongs to the specified task.
	 * The user must also have the necessary permissions to delete the comment within the task, project, and organization.
	 *
	 * @param {string} id - The ID of the task the comment belongs to.
	 * @param {string} commentId - The ID of the comment to delete.
	 * @param {string} organizationId - The ID of the organization to which the task belongs.
	 * @param {string} userId - The ID of the user requesting the deletion. The user must be the author of the comment.
	 *
	 * @returns {Promise<Comment>} The deleted comment, including the author's details (ID, name, email).
	 *
	 * @throws {ForbiddenException} If the comment cannot be found.
	 * @throws {ForbiddenException} If the user does not own the comment they are attempting to delete.
	 * @throws {ForbiddenException} If the comment does not belong to the specified task.
	 * @throws {ForbiddenException} If the user does not have permission to delete the comment for the task.
	 *
	 * @example
	 * // Delete a comment from a task
	 * const deletedComment = await taskService.deleteComment({
	 *   id: 'task1',
	 *   commentId: 'comment1',
	 *   organizationId: 'org1',
	 *   userId: 'user1'
	 * });
	 * // Returns the deleted comment, including the author's details
	 */
	async deleteComment({
		id,
		commentId,
		organizationId,
		userId
	}: {
		id: string;
		commentId: string;
		organizationId: string;
		userId: string;
	}) {
		// Find the comment to delete
		const comment = await this.prisma.comment.findUnique({
			where: { id: commentId }
		});
		if (!comment) {
			throw new ForbiddenException('Comment not found.');
		}

		// Ensure the user is deleting their own comment
		if (comment.userId !== userId) {
			throw new ForbiddenException('You can only delete your own comments.');
		}

		// Check that the comment belongs to the correct task
		const task = await this.prisma.task.findUnique({
			where: { id: comment.taskId }
		});
		if (!task || task.id !== id) {
			throw new ForbiddenException(
				'The comment does not belong to the specified task.'
			);
		}

		// Check user permissions for the task, project, team, and organization
		await this.checkUserPermission({
			userId,
			projectId: task.projectId,
			teamId: task.teamId,
			organizationId
		});

		// Delete the comment
		return this.prisma.comment.delete({
			where: { id: commentId },
			include: {
				user: { select: { id: true, name: true, email: true } }
			}
		});
	}

	/**
	 * Private function to check the user's access to the organization, project, and team.
	 * This function ensures that the user has the required permissions to access the given resources.
	 * It verifies the user's membership status in the organization, project, and team, and throws appropriate
	 * exceptions if the user does not have the necessary access rights.
	 *
	 * The function works as follows:
	 * - First, it checks if the user is a member of the organization.
	 * - If the user is banned, an exception is thrown.
	 * - If the user is an admin or owner, no further checks are required.
	 * - If a project ID is provided, it checks if the user is part of the project.
	 * - If a team ID is provided, it checks if the user is part of the team and has the correct status.
	 *
	 * @param {Object} params - The parameters for permission checks.
	 * @param {string} params.userId - The ID of the user to check.
	 * @param {string} [params.projectId] - Optional project ID for project-level access check.
	 * @param {string} [params.teamId] - Optional team ID for team-level access check.
	 * @param {string} params.organizationId - The organization ID to check access against.
	 *
	 * @throws {ForbiddenException} If the user is not a member of the organization.
	 * @throws {ForbiddenException} If the user is banned from the organization.
	 * @throws {ForbiddenException} If the user does not have access to the project.
	 * @throws {ForbiddenException} If the user does not have access to the team.
	 *
	 * @example
	 * // Check user permissions for accessing a team within a project in an organization
	 * await checkUserPermission({
	 *   userId: 'user1',
	 *   organizationId: 'org1',
	 *   projectId: 'project1',
	 *   teamId: 'team1'
	 * });
	 * // Will throw a ForbiddenException if the user does not have access
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
			if (projectId) {
				const projectUser = await this.prisma.projectUser.findFirst({
					where: { userId, projectId }
				});

				if (projectUser.role !== ProjectRole.MANAGER) {
					if (!teamUser || teamUser.teamStatus !== AccessStatus.ACTIVE) {
						throw new ForbiddenException(
							'You do not have access to this team.'
						);
					}
				}
			} else {
				if (!teamUser || teamUser.teamStatus !== AccessStatus.ACTIVE) {
					throw new ForbiddenException('You do not have access to this team.');
				}
			}
		}
	}
}
