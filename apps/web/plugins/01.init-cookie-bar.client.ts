export default defineNuxtPlugin(() => {
  nextTick(() => {
    const { initializeCookies } = useCookieBar();
    initializeCookies();
  });
});
