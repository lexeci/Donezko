import { IsArray, IsString } from 'class-validator';

/**
 * UpdateOrderDto - Data Transfer Object for updating the order of time blocks.
 *
 * This DTO is used to validate the list of time block IDs in the correct order when updating the sequence
 * of time blocks in the user's schedule. It includes:
 * - `ids`: An array of time block IDs, each represented as a string, that specifies the new order.
 *
 * @class UpdateOrderDto
 */
export class UpdateOrderDto {
	/**
	 * The list of time block IDs, arranged in the desired order.
	 *
	 * The order of the IDs in this array determines the new sequence of time blocks.
	 * Each ID should correspond to an existing time block.
	 *
	 * @example ["123", "456", "789"]
	 * @type {string[]}
	 * @required
	 */
	@IsArray()
	@IsString({ each: true })
	ids: string[];
}
