export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    const pwaCookie = useCookie('pwa');
    
    if (pwaCookie.value) {
      useRuntimeConfig().public.isPreview = !!pwaCookie.value;
    }
  }
});
