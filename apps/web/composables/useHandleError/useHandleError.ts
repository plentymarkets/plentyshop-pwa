import { NuxtError } from 'nuxt/app';
import type { UseHandleError } from '~/composables/useHandleError/types';
import { PlentyError } from '~/sdk.client';


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
export const useHandleError: UseHandleError = (error: PlentyError | NuxtError<unknown> | null) => {
  if (error && import.meta.client) {
    const { send } = useNotification();
    const type = 'negative';
    const persist = true;
    console.log(error);

    if (error instanceof PlentyError) {
      const message = `${error.code}: ${error.message}`;

      send({
        type,
        message,
        persist,
      });
    } else {
      const nuxtError = error as any;
      const message = `${nuxtError?.status}: ${nuxtError.statusText}`;
      
      send({
        type,
        message,
        persist,
      });
    }
  }
};
