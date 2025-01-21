/**
 * Generates a unique key by combining a provided prefix and the current timestamp.
 * This function can be used to generate unique identifiers based on the current time.
 *
 * @param {string} pre - A prefix that will be added at the beginning of the generated key.
 * @returns {string} A unique string composed of the provided prefix and the current timestamp.
 *
 * @example
 * const key = generateKeyComp("task");
 * // Example output: "task_1635174200000"
 */
export default function generateKeyComp(pre: string): string {
    // Use performance.now() for higher resolution timestamps
    const timestamp = Date.now(); // or performance.now();
    return `${pre}_${timestamp}`;
}
