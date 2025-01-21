/**
 * Capitalizes the first letter of a given string and converts the rest to lowercase.
 * Additionally, it replaces any underscores ('_') in the string with spaces (' ').
 *
 * @param {string} val - The string to be transformed.
 * @returns {string} The transformed string with the first letter capitalized and underscores replaced by spaces.
 *
 * @example
 * const capitalizedText = toCapitalizeText('hello_world');
 * // Example output: "Hello world"
 */
export default function toCapitalizeText(val: string): string {
    return (
        String(val)
            .replace(/_/g, " ") // Replace all underscores with spaces
            .charAt(0)
            .toUpperCase() +
        String(val)
            .replace(/_/g, " ") // Replace all underscores with spaces
            .slice(1)
            .toLowerCase()
    );
}
