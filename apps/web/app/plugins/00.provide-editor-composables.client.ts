/**
 * Provides editor composables to the app so that components from npm modules
 * (e.g. uptain-pwa-beta) can inject them and do not rely on auto-imports.
 */
import { useSiteSettings } from '~/composables/useSiteSettings';
import { getEditorTranslation } from '~/utils/sortingOptionsHelper';

export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp;
  app.provide('useSiteSettings', useSiteSettings);
  app.provide('getEditorTranslation', getEditorTranslation);
});
