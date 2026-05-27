/**
 * This plugin reads the preview cookie and sets the isEditor property in the context.
 * This property is used to determine if the app is in preview mode or not.
 * The plugin replaces the `onMounted` function to determine the mode on SSR.
 */
export default defineNuxtPlugin({
  name: 'pwa-cookie',
  parallel: true,
  setup() {
    const pwaCookie = useCookie('pwa');
    const isEditorCookie = useCookie('isEditor');

    return {
      provide: {
        isEditor: (!!pwaCookie.value && isEditorCookie.value) || useRuntimeConfig().public.isEditor,
      },
    };
  },
});
