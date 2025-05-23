/**
 * This plugin reads the preview cookie and sets the isPreview property in the context.
 * This property is used to determine if the app is in preview mode or not.
 * The plugin replaces the `onMounted` function to determine the mode on SSR.
 * 
 * Due to limitations in Vite, the development server has to handle this case differently and rely on client-side rendering.
 * Attempting to use SSR in development mode will result in a disconnect whenever the app restarts, e.g. after updating the Nuxt config.
 * 
 * @see https://vite.dev/config/server-options#server-watch
 * @see https://github.com/nuxt/nuxt/issues/12822#issuecomment-1397285993
 */

export default defineNuxtPlugin(() => {
  const pwaCookie = useCookie('pwa');
  
  if (import.meta.dev) {
    if (import.meta.server) {
      return
    } else {
      return {
        provide: {
          isPreview: !!pwaCookie.value || useRuntimeConfig().public.isPreview,
        }
      };
    }
  }

  return {
    provide: {
      isPreview: !!pwaCookie.value,
    }
  }
});
