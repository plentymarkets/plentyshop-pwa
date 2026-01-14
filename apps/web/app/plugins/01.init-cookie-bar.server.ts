export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const { initializeCookies } = useCookieBar();
    initializeCookies();
  },
});
