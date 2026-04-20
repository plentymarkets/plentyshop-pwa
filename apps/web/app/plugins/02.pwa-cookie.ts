export default defineNuxtPlugin({
  name: 'pwa-cookie',
  parallel: true,
  setup() {
    const pwaCookie = useCookie('pwa');

    return {
      provide: {
        isPreview: !!pwaCookie.value || useRuntimeConfig().public.isPreview,
      },
    };
  },
});
