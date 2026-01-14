export default defineNuxtPlugin({
  name: 'init-cookie-bar',
  parallel: true,
  setup() {
    const { initializeCookies } = useCookieBar();
    initializeCookies();
  },
});
