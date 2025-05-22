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
