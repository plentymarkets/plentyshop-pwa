import { resolvePreviewState } from '~/utils/pwaPreview';

/**
 * This plugin checks for the presence of a 'pwa' cookie to determine if the user is in preview mode.
 */
export default defineNuxtPlugin({
  name: 'pwa-cookie',
  parallel: true,
  async setup() {
    const pwaCookie = useCookie('pwa');
    const {
      public: { isPreview: isPreviewConfig },
    } = useRuntimeConfig();

    const getPreviewValid = async () => {
      const data = await useSdk().plentysystems.getPreviewValid();

      return data?.data;
    };

    const isPreview = await resolvePreviewState({
      cookieValue: pwaCookie.value,
      isPreviewConfig,
      getPreviewValid: () => getPreviewValid(),
    }).catch(() => {
      return false;
    });

    return {
      provide: { isPreview },
    };
  },
});
