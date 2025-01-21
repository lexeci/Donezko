/**
 * Interface for error response structure.
 * Defines the shape of error objects returned from the server.
 * @interface ErrorResponse
 */
interface ErrorResponse {
    response?: {
        data?: {
            message?: string | string[]; // Message(s) containing error details
        };
    };
    message?: string; // General error message
}

/**
 * Function to parse and retrieve a clear error message from the error object.
 * If the error contains a `response.data.message`, it returns the first message (if it's an array) or the message directly.
 * If no specific message is found, it returns the `message` from the error object, or defaults to 'Unknown error occurred'.
 * @param error - The error object to parse
 * @returns {string} - The parsed error message
 * @example
 * const error = { response: { data: { message: "Invalid request" } } };
 * const message = parseErrorMessage(error); // "Invalid request"
 */
export const parseErrorMessage = (error: unknown): string => {
    const err = error as ErrorResponse; // Type assertion to ensure correct shape
    const message = err?.response?.data?.message; // Extract the error message from the response

    // If a message is present, return the first one if it's an array
    if (message) {
        return Array.isArray(message) ? message[0] : message;
    }

    // If no message in the response, return the general message or a default message
    return err.message || 'Unknown error occurred';
};
