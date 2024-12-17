import { PrismaService } from '@/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { TimeBlockDto } from './dto/time-block.dto';

/**
 * TimeBlockService - Service for managing time blocks for a user.
 *
 * This service provides CRUD operations for handling time blocks associated with a user. A time block represents
 * a segment of time within a user's schedule and can be created, updated, deleted, or reordered.
 *
 * @class TimeBlockService
 */
@Injectable()
export class TimeBlockService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Retrieves all time blocks for a specific user.
	 *
	 * This method fetches all time blocks belonging to the specified user, ordered by their `order` field.
	 *
	 * @param {string} userId - The ID of the user whose time blocks are being retrieved.
	 * @returns {Promise<TimeBlock[]>} A promise that resolves to the list of time blocks for the user.
	 */
	async getAll(userId: string) {
		return this.prisma.timeBlock.findMany({
			where: {
				userId
			},
			orderBy: {
				order: 'asc'
			}
		});
	}

	/**
	 * Creates a new time block for a user.
	 *
	 * This method creates a new time block and associates it with the given user.
	 *
	 * @param {TimeBlockDto} dto - The data transfer object containing the details of the time block to be created.
	 * @param {string} userId - The ID of the user to whom the time block will be assigned.
	 * @returns {Promise<TimeBlock>} A promise that resolves to the created time block.
	 */
	async create(dto: TimeBlockDto, userId: string) {
		return this.prisma.timeBlock.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId
					}
				}
			}
		});
	}

	/**
	 * Updates an existing time block for a user.
	 *
	 * This method updates the properties of a specific time block identified by its ID and user association.
	 *
	 * @param {Partial<TimeBlockDto>} dto - The updated data for the time block.
	 * @param {string} timeBlockId - The ID of the time block to be updated.
	 * @param {string} userId - The ID of the user who owns the time block.
	 * @returns {Promise<TimeBlock>} A promise that resolves to the updated time block.
	 */
	async update(
		dto: Partial<TimeBlockDto>,
		timeBlockId: string,
		userId: string
	) {
		return this.prisma.timeBlock.update({
			where: {
				userId,
				id: timeBlockId
			},
			data: dto
		});
	}

	/**
	 * Deletes a time block for a user.
	 *
	 * This method deletes a specific time block based on its ID and the user ID it is associated with.
	 *
	 * @param {string} timeBlockId - The ID of the time block to be deleted.
	 * @param {string} userId - The ID of the user who owns the time block.
	 * @returns {Promise<TimeBlock>} A promise that resolves to the deleted time block.
	 */
	async delete(timeBlockId: string, userId: string) {
		return this.prisma.timeBlock.delete({
			where: {
				id: timeBlockId,
				userId
			}
		});
	}

	/**
	 * Updates the order of time blocks for a user.
	 *
	 * This method updates the `order` field of multiple time blocks based on the provided list of time block IDs.
	 * The order is determined by the order of IDs in the array.
	 *
	 * @param {string[]} ids - An array of time block IDs in the desired order.
	 * @returns {Promise<void>} A promise that resolves when the order has been updated for all time blocks.
	 */
	async updateOrder(ids: string[]) {
		return this.prisma.$transaction(
			ids.map((id, order) =>
				this.prisma.timeBlock.update({
					where: { id },
					data: { order }
				})
			)
		);
	}
}
