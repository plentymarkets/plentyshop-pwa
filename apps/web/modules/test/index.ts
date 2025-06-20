import { defineNuxtModule, updateRuntimeConfig } from '@nuxt/kit';

export default defineNuxtModule({
  setup(options, nuxt) {
    updateRuntimeConfig({
      public: {
        secondaryColor: '#fff',
      },
    });
  },
});
