import type { UseHandleError, ErrorParams } from '~/composables/useHandleError/types';

const defaultError: ErrorParams = {
  status: 500,
  message: 'An error occurred',
  statusMessage: 'An error occurred',
};

/**
 * @description Composable for handling errors.
 * @param error { ErrorParams }
 * @returns Throws an error if there is one.
 * @example
 * ``` ts
 * const { data, error } = useHandleError({
 *   status: ''
 *   statusText: ''
 * });
 * ```
 */
export const useHandleError: UseHandleError = (error: ErrorParams) => {
  if (error && process.client) {
    const { send } = useNotification();

    console.error(error);
    send({
      type: 'negative',
      message: error.message ?? defaultError.message ?? 'An error occurred',
      persist: true,
    });
  }
};
