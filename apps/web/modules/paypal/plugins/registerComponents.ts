import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    const { addPush } = useExtendCheckout('checkout:after:buy');
    addPush('ModuleTest');
  }
});
