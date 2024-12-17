import { PrismaService } from '@/src/prisma.service';
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { AccessStatus, OrgRole } from '@prisma/client';
import { OrgDto } from './dto/org.dto';

@Injectable()
export class OrgService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.organizationUser.findMany({
			where: { userId: userId, organizationStatus: 'ACTIVE' },
			select: {
				organization: true,
				role: true,
				organizationStatus: true
			}
		});
	}

	async create(dto: OrgDto, userId: string) {
		return this.prisma.organization.create({
			data: {
				...dto,
				organizationUsers: {
					create: [
						{
							role: OrgRole.OWNER,
							user: {
								connect: { id: userId }
							}
						}
					]
				}
			}
		});
	}

	async update(dto: Partial<OrgDto>, id: string, userId: string) {
		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId: id, userId, role: OrgRole.OWNER }
		});

		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the organization owner can update organization details.'
			);
		}

		return this.prisma.organization.update({
			where: { id },
			data: dto
		});
	}

	async join(dto: Partial<OrgDto>, userId: string) {
		const { joinCode, title } = dto;

		const organization = await this.prisma.organization.findFirst({
			where: { joinCode, title }
		});

		if (!organization) {
			throw new NotFoundException(
				'Organization with this join code and title not found.'
			);
		}

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: organization.id }
		});

		if (existingMembership) {
			throw new ForbiddenException(
				'User is already a member of this organization.'
			);
		}

		return this.prisma.organizationUser.create({
			data: {
				userId,
				organizationId: organization.id,
				role: OrgRole.VIEWER
			}
		});
	}

	async updateRole(
		dto: Partial<OrgDto>,
		organizationId: string,
		currentUserId: string
	) {
		const { userId, role: updatedRole } = dto;

		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId, userId: currentUserId, role: OrgRole.OWNER }
		});

		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the organization owner can update user roles.'
			);
		}

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		if (existingMembership.organizationStatus === AccessStatus.BANNED) {
			throw new ForbiddenException('Cannot update role of a banned user.');
		}

		if (updatedRole === OrgRole.OWNER) {
			throw new ForbiddenException(
				'Only the main owner can hold the OWNER role.'
			);
		}

		if (updatedRole === existingMembership.role) {
			throw new ForbiddenException('The role is already assigned.');
		}

		if (existingMembership.role === OrgRole.OWNER) {
			throw new ForbiddenException('Cannot change the role of the owner.');
		}

		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: { role: updatedRole }
		});
	}

	async updateStatus(
		dto: Partial<OrgDto>,
		organizationId: string,
		currentUserId: string
	) {
		const { userId, organizationStatus: updatedStatus } = dto;

		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId, userId: currentUserId, role: OrgRole.OWNER }
		});

		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the organization owner can update user statuses.'
			);
		}

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		if (organizationOwner.userId === userId) {
			throw new ForbiddenException('Cannot change the owner’s access status.');
		}

		if (existingMembership.organizationStatus === updatedStatus) {
			throw new ForbiddenException(
				`The user already has status ${updatedStatus}`
			);
		}

		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: {
				...(updatedStatus == AccessStatus.BANNED && { role: OrgRole.VIEWER }),
				organizationStatus: updatedStatus
			}
		});
	}

	async updateOwner(
		dto: Partial<OrgDto>,
		currentOwner: string,
		organizationId: string
	) {
		const { userId } = dto;

		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'User is not a member of this organization.'
			);
		}

		if (existingMembership.organizationStatus == AccessStatus.BANNED) {
			throw new ForbiddenException(
				'User is banned member of this organization. You can not transfer ownership to banned user. Change user status first'
			);
		}

		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId, role: OrgRole.OWNER }
		});

		if (currentOwner === userId) {
			throw new ForbiddenException("You can't transfer ownership to yourself.");
		}

		if (organizationOwner && organizationOwner.userId === userId) {
			throw new ForbiddenException(
				'The user is already the owner of this organization.'
			);
		}

		if (organizationOwner && organizationOwner.userId !== currentOwner) {
			throw new ForbiddenException(
				'You are not the owner of this organization.'
			);
		}

		await this.prisma.organizationUser.update({
			where: { id: organizationOwner.id },
			data: { role: OrgRole.MEMBER }
		});

		return this.prisma.organizationUser.update({
			where: { id: existingMembership.id },
			data: { role: OrgRole.OWNER }
		});
	}

	async exit(id: string, userId: string) {
		const existingMembership = await this.prisma.organizationUser.findFirst({
			where: { userId, organizationId: id }
		});

		if (!existingMembership) {
			throw new ForbiddenException(
				'You are not a member of this organization.'
			);
		}

		if (existingMembership.role === OrgRole.OWNER) {
			throw new ForbiddenException('Owner cannot exit the organization.');
		}

		return this.prisma.organizationUser.delete({
			where: { id: existingMembership.id }
		});
	}

	async delete(orgId: string, userId: string) {
		const organizationOwner = await this.prisma.organizationUser.findFirst({
			where: { organizationId: orgId, userId, role: OrgRole.OWNER }
		});

		if (!organizationOwner) {
			throw new ForbiddenException(
				'Only the owner can delete the organization.'
			);
		}

		return this.prisma.organization.delete({
			where: { id: orgId }
		});
	}
}
