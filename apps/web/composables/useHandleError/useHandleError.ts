import { NuxtError } from 'nuxt/app';
import type { UseHandleError } from '~/composables/useHandleError/types';
import { Notification } from '../useNotification';

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
  if (error && import.meta.client) {
    const { send } = useNotification();
    let message = defaultError.message;
    let type: Notification['type'] = 'negative';
    let persist = true;
    let cause: any = {};

    if (error.cause) {
      cause = error.cause;
    }
    if (error.statusCode && errorCodes[error.statusCode as keyof typeof errorCodes]) {
      message = errorCodes[error.statusCode as keyof typeof errorCodes];
    } else if (cause?.warn) {
      message = cause.warn.message;
      type = 'warning';
      persist = false;
    } else if (cause && cause?.message) {
      message = cause.message;
    } else {
      message = error.message;
    }

    send({
      type,
      message,
      persist,
    });
  }
};
