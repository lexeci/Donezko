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
import { TimeBlockDto } from './dto/time-block.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TimeBlockService } from './time-block.service';

/**
 * TimeBlockController - Controller for managing time blocks.
 *
 * This controller exposes various endpoints for managing time blocks associated with a user. A time block represents
 * a segment of time within a user's schedule that can be created, updated, reordered, or deleted.
 * The controller performs actions by delegating the actual logic to the `TimeBlockService` and ensures
 * that only authenticated users can interact with the time blocks.
 *
 * @module TimeBlockController
 */
@Controller('user/time-blocks')
export class TimeBlockController {
	/**
	 * Constructor for TimeBlockController.
	 *
	 * @param {TimeBlockService} timeBlockService - The service used to handle the business logic of time block operations.
	 */
	constructor(private readonly timeBlockService: TimeBlockService) {}

	/**
	 * Retrieves all time blocks for the authenticated user.
	 *
	 * @param {string} userId - The ID of the current authenticated user.
	 * @returns {Promise<any>} The list of time blocks associated with the user.
	 * @route GET /user/time-blocks
	 * @access Authenticated users only.
	 */
	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.timeBlockService.getAll(userId);
	}

	/**
	 * Creates a new time block for the authenticated user.
	 *
	 * @param {TimeBlockDto} dto - The data transfer object containing time block details.
	 * @param {string} userId - The ID of the current authenticated user.
	 * @returns {Promise<any>} The newly created time block.
	 * @route POST /user/time-blocks
	 * @access Authenticated users only.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: TimeBlockDto, @CurrentUser('id') userId: string) {
		return this.timeBlockService.create(dto, userId);
	}

	/**
	 * Updates the order of time blocks for the authenticated user.
	 *
	 * @param {UpdateOrderDto} updateOrderDto - The data transfer object containing the new order of time block IDs.
	 * @returns {Promise<any>} The updated time block order.
	 * @route PUT /user/time-blocks/update-order
	 * @access Authenticated users only.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('update-order')
	@Auth()
	async updateOrder(@Body() updateOrderDto: UpdateOrderDto) {
		return this.timeBlockService.updateOrder(updateOrderDto.ids);
	}

	/**
	 * Updates an existing time block for the authenticated user.
	 *
	 * @param {TimeBlockDto} dto - The data transfer object containing the updated time block details.
	 * @param {string} userId - The ID of the current authenticated user.
	 * @param {string} id - The ID of the time block to be updated.
	 * @returns {Promise<any>} The updated time block.
	 * @route PUT /user/time-blocks/:id
	 * @access Authenticated users only.
	 */
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Body() dto: TimeBlockDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.timeBlockService.update(dto, id, userId);
	}

	/**
	 * Deletes a time block for the authenticated user.
	 *
	 * @param {string} userId - The ID of the current authenticated user.
	 * @param {string} id - The ID of the time block to be deleted.
	 * @returns {Promise<any>} A confirmation of the deletion.
	 * @route DELETE /user/time-blocks/:id
	 * @access Authenticated users only.
	 */
	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.timeBlockService.delete(id, userId);
	}
}
