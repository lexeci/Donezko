/**
 * Formats a given number of seconds into a string in the format "MM:SS".
 * This function is useful for displaying elapsed or remaining time in a human-readable format.
 *
 * @param {number} secondsLeft - The number of seconds to format.
 * @returns {string} The formatted time string in "MM:SS" format.
 *
 * @example
 * const formattedTime = timeFormatter(125);
 * // Example output: "02:05"
 */
export function timeFormatter(secondsLeft: number): string {
    const minutes = Math.floor(secondsLeft / 60); // Calculate total minutes
    const seconds = secondsLeft % 60; // Calculate remaining seconds

    // Format the time as "MM:SS" with leading zero for seconds if necessary
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Converts a timestamp into a string formatted in 12-hour AM/PM format (e.g., "5:30 PM").
 *
 * @param {Date} timestamp - The timestamp to format, represented as a JavaScript Date object.
 * @returns {string} The formatted time string in 12-hour AM/PM format.
 *
 * @example
 * const formattedTime = formatTimestampToAmPm(new Date());
 * // Example output: "5:30 PM"
 */
export function formatTimestampToAmPm(timestamp: Date): string {
    const date = new Date(timestamp);

    let hour = date.getHours(); // Get the hour of the day

    const period = hour >= 12 ? "PM" : "AM"; // Determine whether it's AM or PM

    const formattedHour = hour % 12 || 12; // Convert to 12-hour format

    const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes and ensure two digits

    return `${formattedHour}:${minutes} ${period}`; // Return formatted time
}

/**
 * Converts a timestamp into a string formatted as "Day Month Year AM/PM".
 * The function also uses the `formatTimestampToAmPm` function to include the time in AM/PM format.
 *
 * @param {Date} timestamp - The timestamp to format.
 * @returns {string} The formatted date and time string.
 *
 * @example
 * const formattedDate = formatDateToDayMonthYear(new Date());
 * // Example output: "5 September 2023 5:30 PM"
 */
export function formatDateToDayMonthYear(timestamp: Date): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(timestamp);

    const day = date.getDate(); // Get the day of the month
    const month = months[date.getMonth()]; // Get the month name
    const year = date.getFullYear(); // Get the year

    // Format the full date with the time in AM/PM format
    return `${day} ${month} ${year} ${formatTimestampToAmPm(timestamp)}`;
}
