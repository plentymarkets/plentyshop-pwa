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

    send({
      type: 'negative',
      message:
        errorCodes[cause.statusCode as keyof typeof errorCodes] ??
        cause.message ??
        error.message ??
        defaultError.message,
      persist: true,
    });
  }
};
