import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * TimeBlockDto - Data Transfer Object for creating or updating a time block.
 * 
 * A time block represents a segment of time within a user's schedule. This DTO is used to validate the data
 * for creating or updating a time block. It includes the following properties:
 * - `title`: The title or name of the time block.
 * - `color`: An optional field to specify the color associated with the time block.
 * - `duration`: The duration of the time block in minutes.
 * - `order`: An optional field to specify the order of the time block in the user's schedule.
 *
 * @class TimeBlockDto
 */
export class TimeBlockDto {
	/**
	 * The title of the time block.
	 * 
	 * @example "Work Session"
	 * @type {string}
	 * @required
	 */
	@IsString()
	title: string;

	/**
	 * The color associated with the time block (optional).
	 * 
	 * @example "#FF5733"
	 * @type {string}
	 * @optional
	 */
	@IsOptional()
	@IsString()
	color?: string;

	/**
	 * The duration of the time block, in minutes.
	 * 
	 * @example 30
	 * @type {number}
	 * @required
	 */
	@IsNumber()
	duration: number;

	/**
	 * The order of the time block in the user's schedule (optional).
	 * 
	 * @example 1
	 * @type {number}
	 * @optional
	 */
	@IsNumber()
	@IsOptional()
	order: number;
}
