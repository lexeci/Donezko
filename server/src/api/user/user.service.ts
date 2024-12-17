import { AuthDto } from '@/api/auth/dto/auth.dto';
import { PrismaService } from '@/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { UserDto } from './dto/user.dto';

import { startOfDay, subDays } from 'date-fns';

/**
 * UserService - Service for managing user-related operations such as creating, updating, and retrieving user data.
 *
 * Provides functionality to:
 * - Retrieve user by ID or email.
 * - Retrieve user profile statistics (total tasks, completed tasks, today's tasks, and week's tasks).
 * - Create a new user.
 * - Update user information, including password.
 *
 * @module UserService
 */
@Injectable()
export class UserService {
	/**
	 * @constructor
	 * @param {PrismaService} prisma - The PrismaService instance for interacting with the database.
	 */
	constructor(private prisma: PrismaService) {}

	/**
	 * Get a user by their unique ID.
	 *
	 * Retrieves user details along with associated tasks from the database.
	 *
	 * @param {string} id - The unique identifier of the user.
	 * @returns {Promise<Object>} The user object along with associated tasks.
	 */
	getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true
			}
		});
	}

	/**
	 * Get a user by their email address.
	 *
	 * Retrieves user details along with associated tasks from the database based on the email.
	 *
	 * @param {string} email - The email address of the user.
	 * @returns {Promise<Object>} The user object along with associated tasks.
	 */
	getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				tasks: true
			}
		});
	}

	/**
	 * Get a user's profile with task statistics.
	 *
	 * Retrieves the user's profile details and calculates task statistics, including:
	 * - Total number of tasks
	 * - Completed tasks count
	 * - Tasks created today
	 * - Tasks created in the past week
	 *
	 * @param {string} id - The unique identifier of the user.
	 * @returns {Promise<Object>} The user's profile details along with statistics.
	 */
	async getProfile(id: string) {
		const profile = await this.getById(id);

		const totalTask = profile.tasks.length;
		const completedTasks = await this.prisma.task.count({
			where: {
				userId: id,
				isCompleted: true
			}
		});

		const todayStart = startOfDay(new Date());
		const weekStart = startOfDay(subDays(new Date(), 7));

		const todayTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: todayStart.toISOString()
				}
			}
		});

		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: weekStart.toISOString()
				}
			}
		});

		// Removing password field before returning the profile data
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...rest } = profile;

		return {
			user: rest,
			statistics: [
				{ label: 'Total tasks', value: totalTask },
				{ label: 'Completed Tasks', value: completedTasks },
				{ label: 'Today Tasks', value: todayTasks },
				{ label: 'Week tasks', value: weekTasks }
			]
		};
	}

	/**
	 * Create a new user in the system.
	 *
	 * Hashes the provided password and stores the new user in the database.
	 *
	 * @param {AuthDto} dto - The data transfer object containing user email and password.
	 * @returns {Promise<Object>} The created user object.
	 */
	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: dto.email,
			password: await hash(dto.password) // Hash the password before storing
		};

		return this.prisma.user.create({
			data: user
		});
	}

	/**
	 * Update a user's information.
	 *
	 * Updates the user's details, including password (if provided). The password will be hashed before being saved.
	 *
	 * @param {string} id - The unique identifier of the user to update.
	 * @param {UserDto} dto - The data transfer object containing the user's updated information.
	 * @returns {Promise<Object>} The updated user object.
	 */
	async update(id: string, dto: UserDto) {
		let data = dto;

		// If the password is provided, hash it before updating
		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) };
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data,
			select: {
				id: true,
				name: true,
				email: true
			}
		});
	}
}
