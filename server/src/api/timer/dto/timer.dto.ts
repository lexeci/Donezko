import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

/**
 * TimerSessionDto - Data transfer object for updating or creating a timer session.
 *
 * This class is used to validate and structure the data for a timer session. It includes properties like `isCompleted`
 * to indicate the status of the timer session.
 *
 * @class TimerSessionDto
 */
export class TimerSessionDto {
	/**
	 * Indicates whether the timer session is completed.
	 *
	 * This property is optional. If provided, it will be used to mark the session as completed or not.
	 *
	 * @type {boolean}
	 * @optional
	 */
	@IsOptional()
	@IsBoolean()
	isCompleted: boolean;
}

/**
 * TimerRoundDto - Data transfer object for updating or creating a timer round.
 *
 * This class is used to validate and structure the data for a timer round within a session. It includes properties like
 * `totalSeconds` to track the duration of the round and `isCompleted` to mark the status of the round.
 *
 * @class TimerRoundDto
 */
export class TimerRoundDto {
	/**
	 * Total seconds that have passed during the round.
	 *
	 * This property is required and should contain a numerical value representing the total time elapsed in seconds.
	 *
	 * @type {number}
	 * @required
	 */
	@IsNumber()
	totalSeconds: number;

	/**
	 * Indicates whether the timer round is completed.
	 *
	 * This property is optional. If provided, it will mark the round as completed or not.
	 *
	 * @type {boolean}
	 * @optional
	 */
	@IsOptional()
	@IsBoolean()
	isCompleted: boolean;
}
