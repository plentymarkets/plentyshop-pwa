import { defineNuxtModule, updateRuntimeConfig } from '@nuxt/kit';

export default defineNuxtModule({
  setup() {
    updateRuntimeConfig({
      public: {
        secondaryColor: '#fff',
      },
    });
  },
});
