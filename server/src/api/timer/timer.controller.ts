import { Auth } from '@/api/auth/decorators/auth.decorator';
import { CurrentUser } from '@/api/auth/decorators/user.decorator';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { TimerRoundDto, TimerSessionDto } from './dto/timer.dto';
import { TimerService } from './timer.service';

/**
 * TimerController - Controller responsible for exposing API endpoints for managing user timers.
 *
 * This controller handles HTTP requests related to the timer functionality, including:
 * - Creating a new timer session
 * - Updating existing timer sessions and rounds
 * - Fetching today's session
 * - Deleting timer sessions
 *
 * The controller ensures that the requests are authenticated and that valid data is passed to the service.
 *
 * @controller TimerController
 */
@Controller('user/timer')
export class TimerController {
	/**
	 * Creates an instance of the TimerController.
	 *
	 * @param {TimerService} timerService - The service responsible for the business logic of managing timers.
	 */
	constructor(private readonly timerService: TimerService) {}

	/**
	 * Fetches the timer session for today for the authenticated user.
	 *
	 * This endpoint retrieves the user's timer session for today, including all rounds. If a session exists, it returns the
	 * current session, otherwise, it creates a new one.
	 *
	 * @param {string} userId - The ID of the currently authenticated user.
	 * @returns {Promise<any>} - A promise that resolves with the timer session for today.
	 *
	 * @route GET /user/timer/today
	 * @auth Requires authentication.
	 */
	@Get('today')
	@Auth() // Ensures the user is authenticated
	async getTodaySession(@CurrentUser('id') userId: string) {
		return this.timerService.getTodaySession(userId);
	}

	/**
	 * Creates a new timer session for the authenticated user.
	 *
	 * This endpoint creates a new timer session if one doesn't already exist for today.
	 *
	 * @param {string} userId - The ID of the currently authenticated user.
	 * @returns {Promise<any>} - A promise that resolves with the created timer session.
	 *
	 * @route POST /user/timer
	 * @auth Requires authentication.
	 */
	@HttpCode(200)
	@Post()
	@Auth() // Ensures the user is authenticated
	async create(@CurrentUser('id') userId: string) {
		return this.timerService.create(userId);
	}

	/**
	 * Updates a specific round in the user's timer session.
	 *
	 * This endpoint allows the user to update the details of a specific round, such as total seconds or round status.
	 *
	 * @param {string} id - The ID of the timer round to update.
	 * @param {TimerRoundDto} dto - The data transfer object containing updated information for the round.
	 * @returns {Promise<any>} - A promise that resolves with the updated round.
	 *
	 * @route PUT /user/timer/round/:id
	 * @auth Requires authentication.
	 * @validation Ensures that the input data is valid.
	 */
	@UsePipes(new ValidationPipe()) // Ensures input validation
	@HttpCode(200)
	@Put('/round/:id')
	@Auth() // Ensures the user is authenticated
	async updateRound(@Param('id') id: string, @Body() dto: TimerRoundDto) {
		return this.timerService.updateRound(dto, id);
	}

	/**
	 * Updates the entire timer session for the authenticated user.
	 *
	 * This endpoint allows the user to update the details of their current timer session, such as the session's status or progress.
	 *
	 * @param {string} id - The ID of the timer session to update.
	 * @param {string} userId - The ID of the authenticated user.
	 * @param {TimerSessionDto} dto - The data transfer object containing updated session details.
	 * @returns {Promise<any>} - A promise that resolves with the updated session.
	 *
	 * @route PUT /user/timer/:id
	 * @auth Requires authentication.
	 * @validation Ensures that the input data is valid.
	 */
	@UsePipes(new ValidationPipe()) // Ensures input validation
	@HttpCode(200)
	@Put(':id')
	@Auth() // Ensures the user is authenticated
	async update(
		@Param('id') id: string,
		@CurrentUser('id') userId: string,
		@Body() dto: TimerSessionDto
	) {
		return this.timerService.updateSession(dto, id, userId);
	}

	/**
	 * Deletes a specific timer session for the authenticated user.
	 *
	 * This endpoint allows the user to delete a timer session by its ID. The session will only be deleted if it belongs
	 * to the authenticated user.
	 *
	 * @param {string} id - The ID of the timer session to delete.
	 * @param {string} userId - The ID of the authenticated user.
	 * @returns {Promise<any>} - A promise that resolves once the session has been deleted.
	 *
	 * @route DELETE /user/timer/:id
	 * @auth Requires authentication.
	 */
	@HttpCode(200)
	@Delete(':id')
	@Auth() // Ensures the user is authenticated
	async deleteSession(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.timerService.deleteSession(id, userId);
	}
}
