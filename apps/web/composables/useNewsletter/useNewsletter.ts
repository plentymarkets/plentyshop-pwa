import type { NewsletterParams } from '@plentymarkets/shop-api';
import type {
  UseNewsletterReturn,
  UseNewsletterState,
  Subscribe,
  EmailConfirmationOptin,
} from '~/composables/useNewsletter/types';

/**
 * @description Composable for subscribing/unsubscribing to newsletter.
 * @returns UseNewsletterReturn
 * @example
 * ``` ts
 * const { loading, subscribe } = useNewsletter();
 * ```
 */
export const useNewsletter: UseNewsletterReturn = () => {
  const runtimeConfig = useRuntimeConfig();

  const state = useState<UseNewsletterState>('useNewsletter', () => ({
    loading: false,
    showNewsletter: runtimeConfig.public.newsletterForm,
    showNames: runtimeConfig.public.newsletterFormShowNames,
  }));

  /**
   * @description Function for subscribing to newsletter.
   * @param params { NewsletterParams }
   * @return Promise<boolean>
   * @example
   * ``` ts
   * subscribe({
   *   email: 'test@test.de',
   *   emailFolder: 1,
   * })
   * ```
   */
  const subscribe: Subscribe = async (params: NewsletterParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doSubscribeNewsletter(params));
    useHandleError(error.value);

    state.value.loading = false;
    return !!data.value?.data;
  };

  const confirmEmail: EmailConfirmationOptin = async (newsletterEmailId, authString) => {
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doEmailConfirmation({
        newsletterEmailId: newsletterEmailId,
        authString: authString,
      }),
    );
  };

  return {
    subscribe,
    confirmEmail,
    ...toRefs(state.value),
  };
};
