import { NuxtError } from 'nuxt/app';
import type { UseHandleError } from '~/composables/useHandleError/types';

const defaultError: ErrorParams = {
  statusCode: 500,
  message: 'An error occurred',
  cause: {},
};

const errorCodes = {
  401: 'Unauthorized',
};

/**
 * @description Composable for handling errors.
 * @param error { SdkHttpError }
 * @returns Throws an error if there is one.
 * @example
 * ``` ts
 * const { data, error } = useHandleError({
 *   statusCode: ''
 *   message: ''
 * });
 * ```
 */
export const useHandleError: UseHandleError = (error: ErrorParams | NuxtError<unknown> | null) => {
  if (error && process.client) {
    const { send } = useNotification();
    const { cause } = error as any;

    let message = defaultError.message;

    if (cause) {
      message = errorCodes[cause.statusCode as keyof typeof errorCodes] ?? cause.message ?? error.message;
    }

    send({
      type: 'negative',
      message,
      persist: true,
    });
  }
};
