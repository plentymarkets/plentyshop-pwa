export default defineNuxtPlugin(() => {
  const { initializeCookies } = useCookieBar();
  initializeCookies();
});
