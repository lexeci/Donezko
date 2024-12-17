interface ErrorResponse {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

export const parseErrorMessage = (error: unknown): string => {
  const err = error as ErrorResponse;
  const message = err?.response?.data?.message;

  if (message) {
    return Array.isArray(message) ? message[0] : message;
  }

  return err.message || 'Unknown error occurred';
};