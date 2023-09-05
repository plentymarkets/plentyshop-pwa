import type { UseHandleError, ErrorParams } from './types';

const defaultError: ErrorParams = {
  status: 500,
  message: 'An error occurred',
  statusMessage: 'An error occurred',
};

/**
 * @description Composable for handling errors.
 * @param error {@link ErrorParams}
 * @returns Throws an error if there is one.
 * @example
 * const { data, error } = await fetch(data);
 * useHandleError(error.value);
 */
export const useHandleError: UseHandleError = (error) => {
  const { send } = useNotification();

  if (error) {
    send({
      type: 'negative',
      message: error.message ?? defaultError.message ?? 'An error occurred',
      persist: true,
    });
  }
};
