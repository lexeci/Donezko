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

export function formatTimestampToAmPm(timestamp: Date): string {
    // Створюємо об'єкт дати з timestamp (милісекунди з епохи Unix)
    const date = new Date(timestamp);

    // Отримуємо години
    let hour = date.getHours();

    // Визначаємо AM/PM
    const period = hour >= 12 ? "PM" : "AM";

    // Конвертуємо в 12-годинний формат
    const formattedHour = hour % 12 || 12;

    // Отримуємо хвилини
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${formattedHour}:${minutes} ${period}`;
}

export function formatDateToDayMonthYear(timestamp: Date): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(timestamp);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year} ${formatTimestampToAmPm(timestamp)}`;
}
