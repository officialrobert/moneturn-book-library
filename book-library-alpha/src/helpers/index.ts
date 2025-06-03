import { AxiosError } from 'axios';

/**
 * Get server API base URL.
 *
 * @returns Base URL.
 */
export function getServerApiBaseUrl(): string {
  return 'http://localhost:3001/v1';
}

/**
 * Grab error message from API response.
 *
 * @param err - Error object or AxiosError object.
 * @param defaultMessage - Default error message.
 * @returns Error message.
 */
export function grabApiErrorMessage(
  err: Error | AxiosError | null | undefined,
  defaultMessage?: string,
) {
  if (err instanceof AxiosError) {
    return (
      err.response?.data?.message || defaultMessage || 'Something went wrong'
    );
  }

  if (err instanceof Error) {
    return err.message || defaultMessage || 'Something went wrong';
  }

  return defaultMessage || 'Something went wrong';
}

/**
 * Delay execution for a specified amount of milliseconds.
 *
 * @param ms - Number of milliseconds to delay.
 * @returns Promise that resolves after the specified amount of milliseconds.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(
      () => {
        clearTimeout(timeoutId);
        resolve();
      },
      ms > 0 ? ms : 0,
    );
  });
}
