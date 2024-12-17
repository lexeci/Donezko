/**
 * Formats a given number of seconds into a string in the format "MM:SS".
 *
 * @param {number} secondsLeft - The number of seconds to format.
 * @returns {string} The formatted time string.
 */
export function timeFormatter(secondsLeft: number): string {
	const minutes = Math.floor(secondsLeft / 60); // Calculate total minutes
	const seconds = secondsLeft % 60; // Calculate remaining seconds

	// Format the time as "MM:SS" with leading zero for seconds if necessary
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
