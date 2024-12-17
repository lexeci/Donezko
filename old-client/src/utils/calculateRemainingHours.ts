import { TimeBlockResponse } from '@/types/time-block.types';

/**
 * Calculate the remaining hours left in a day after summing the durations of time blocks.
 * 
 * @param {TimeBlockResponse[] | undefined} items - Array of time block responses.
 * @returns {{ hoursLeft: number }} - Object containing the number of hours left in the day.
 */
export function calculateRemainingHours(items: TimeBlockResponse[] | undefined) {
    // Sum up the total duration in minutes from the provided items
    const totalDurationInMinutes = items?.reduce((total, { duration }) => total + duration, 0) || 0;

    // Convert total duration to hours
    const totalHoursUsed = Math.floor(totalDurationInMinutes / 60);
    
    // Calculate the remaining hours in a 24-hour day
    const remainingHours = Math.max(0, 24 - totalHoursUsed); // Ensures we don't go below 0

    return { hoursLeft: remainingHours };
}
