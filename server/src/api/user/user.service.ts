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
	 * Constructs an instance of UserService.
	 *
	 * @param {PrismaService} prisma - The PrismaService instance for interacting with the database.
	 */
	constructor(private prisma: PrismaService) {}

	/**
	 * Retrieve a user by their unique ID.
	 *
	 * Fetches user details along with tasks assigned to them from the database.
	 *
	 * @param {string} id - The unique identifier of the user.
	 * @returns {Promise<Object>} The user object with associated tasks.
	 *
	 * @example
	 * getById('user-id'); // Returns user data along with tasks assigned to the user.
	 */
	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				tasksAsAssignee: true
			}
		});
	}

	/**
	 * Retrieve a user by their email address.
	 *
	 * Fetches user details along with tasks assigned to them based on the provided email address.
	 *
	 * @param {string} email - The email address of the user.
	 * @returns {Promise<Object>} The user object with associated tasks.
	 *
	 * @example
	 * getByEmail('user@example.com'); // Returns user data along with tasks assigned to the user.
	 */
	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				tasksAsAssignee: true
			}
		});
	}

	/**
	 * Retrieve a user's profile with task statistics.
	 *
	 * Calculates task-related statistics, such as:
	 * - Total number of tasks.
	 * - Number of completed tasks.
	 * - Tasks created today.
	 * - Tasks created this week.
	 *
	 * @param {string} id - The unique identifier of the user.
	 * @returns {Promise<Object>} The user's profile and associated statistics.
	 *
	 * @example
	 * getProfile('user-id'); // Returns user's profile data and statistics (tasks, completed, etc.).
	 */
	async getProfile(id: string) {
		const profile = await this.getById(id);

		const totalTask = profile.tasksAsAssignee.length;
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

		// Remove sensitive data like the password from the profile object before returning it
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
	 * Create a new user.
	 *
	 * Hashes the provided password and stores the user data in the database.
	 *
	 * @param {AuthDto} dto - The data transfer object containing user email and password.
	 * @returns {Promise<Object>} The newly created user object.
	 *
	 * @example
	 * create({ email: 'user@example.com', name: 'John Doe', password: 'password123' }); // Returns newly created user with hashed password.
	 */
	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: dto.name,
			...(dto.city && {
				city: dto.city
			}),
			password: await hash(dto.password) // Hash the password before storing
		};

		return this.prisma.user.create({
			data: user
		});
	}

	/**
	 * Update user information.
	 *
	 * Updates user data such as name, email, and password. If a password is provided, it will be hashed
	 * before being stored in the database.
	 *
	 * @param {string} id - The unique identifier of the user to update.
	 * @param {UserDto} dto - The data transfer object containing updated user data.
	 * @returns {Promise<Object>} The updated user object.
	 *
	 * @example
	 * update({ id: 'user-id', dto: { name: 'John Updated', email: 'new-email@example.com' } }); // Returns updated user object with the new name and email.
	 */
	async update({ id, dto }: { id: string; dto: UserDto }) {
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
