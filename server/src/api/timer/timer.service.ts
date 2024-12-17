import { PrismaService } from '@/src/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TimerRoundDto, TimerSessionDto } from './dto/timer.dto';

/**
 * TimerService - Service to manage timer sessions and rounds for users.
 *
 * This service provides methods to create, update, delete, and fetch timer sessions and rounds.
 * It ensures that the user's session is properly managed and includes the ability to work with multiple rounds within a session.
 * It interfaces with the Prisma ORM to persist data in the database.
 */
@Injectable()
export class TimerService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Fetches the user's timer session for today.
	 *
	 * This method checks if the user has an existing timer session for today. If found, it returns the session along with its rounds.
	 * It compares the session's `createdAt` field with the current date to identify today's session.
	 *
	 * @param {string} userId - The ID of the user for whom the session is fetched.
	 * @returns {Promise<TimerSessionDto | null>} - The user's timer session for today, or null if not found.
	 */
	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0];

		return this.prisma.timerSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today)
				},
				userId
			},
			include: {
				rounds: {
					orderBy: {
						id: 'asc'
					}
				}
			}
		});
	}

	/**
	 * Creates a new timer session for the user if one does not exist for today.
	 *
	 * This method attempts to find a session for the current day. If it does not exist, it creates a new session with a
	 * specified number of rounds based on the user's configuration. Each round starts with a `totalSeconds` value of 0.
	 *
	 * @param {string} userId - The ID of the user for whom the session is created.
	 * @returns {Promise<TimerSessionDto>} - The created timer session.
	 * @throws {NotFoundException} - Throws an exception if the user is not found in the database.
	 */
	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId);

		if (todaySession) return todaySession;

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				intervalsCount: true
			}
		});

		if (!user) throw new NotFoundException('User not found');

		return this.prisma.timerSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => ({
							totalSeconds: 0
						}))
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				rounds: true
			}
		});
	}

	/**
	 * Updates an existing timer session with new data.
	 *
	 * This method allows you to update an existing timer session's data. The `timerId` and `userId` must be provided
	 * to correctly identify the session that needs updating. The `dto` (data transfer object) contains the updated fields.
	 *
	 * @param {Partial<TimerSessionDto>} dto - The data to update the timer session with.
	 * @param {string} timerId - The ID of the timer session to be updated.
	 * @param {string} userId - The ID of the user associated with the timer session.
	 * @returns {Promise<TimerSessionDto>} - The updated timer session.
	 */
	async updateSession(
		dto: Partial<TimerSessionDto>,
		timerId: string,
		userId: string
	) {
		return this.prisma.timerSession.update({
			where: {
				userId,
				id: timerId
			},
			data: dto
		});
	}

	/**
	 * Updates a specific round within a timer session.
	 *
	 * This method updates the data for a specific round, identified by its `roundId`. The `dto` contains the updated
	 * information for the round, such as the total seconds.
	 *
	 * @param {Partial<TimerRoundDto>} dto - The data to update the round with.
	 * @param {string} roundId - The ID of the round to be updated.
	 * @returns {Promise<TimerRoundDto>} - The updated round.
	 */
	async updateRound(dto: Partial<TimerRoundDto>, roundId: string) {
		return this.prisma.timerRound.update({
			where: {
				id: roundId
			},
			data: dto
		});
	}

	/**
	 * Deletes a timer session for a specific user.
	 *
	 * This method deletes the timer session specified by `sessionId` and `userId`. It ensures that the session belongs to
	 * the correct user before deletion.
	 *
	 * @param {string} sessionId - The ID of the timer session to be deleted.
	 * @param {string} userId - The ID of the user associated with the session.
	 * @returns {Promise<TimerSessionDto>} - The deleted timer session.
	 */
	async deleteSession(sessionId: string, userId: string) {
		return this.prisma.timerSession.delete({
			where: {
				id: sessionId,
				userId
			}
		});
	}
}
