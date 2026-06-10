import { HTTPError } from "ky";

export const handleApiError = async (
  error: unknown,
  defaultMessage = "Sorry, something went wrong. Please try again later",
): Promise<string> => {
  if (error instanceof HTTPError) {
    try {
      const errorData = await error.response.json();
      return errorData.message || defaultMessage;
    } catch {
      return defaultMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};
