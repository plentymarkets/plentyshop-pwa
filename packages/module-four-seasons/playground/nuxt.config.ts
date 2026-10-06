export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',
  plentymarketsFourSeasons: {
    enabled: true,
    particleType: 'leaves',
    flakeCount: 60,
  },
});
