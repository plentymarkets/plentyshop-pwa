import { vZLayer } from '~/directives/z-layer';

export default defineNuxtPlugin({
  name: 'z-layer-directive',
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.vueApp.directive('z-layer', vZLayer);
  },
});
