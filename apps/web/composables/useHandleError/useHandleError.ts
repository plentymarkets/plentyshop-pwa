import type { NuxtError } from 'nuxt/app';
import type { UseHandleError } from '~/composables/useHandleError/types';
import { ApiError } from '@plentymarkets/shop-api';

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
export const useHandleError: UseHandleError = (error: ApiError | NuxtError<unknown> | null) => {
  if (error && import.meta.client) {
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const type = 'negative';
    const persist = true;

    if (error instanceof ApiError) {
      const translationKey = `storefrontError.${error.key}`;
      const message = error.key && $i18n.te(translationKey) ? $i18n.t(translationKey) : error.message;
      send({
        type,
        message,
        persist,
      });
    } else {
      const message = $i18n.t('storefrontError.unknownError');

      send({
        type,
        message,
        persist,
      });
    }
  }
};
