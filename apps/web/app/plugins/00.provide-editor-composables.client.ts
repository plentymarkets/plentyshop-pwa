/**
 * Stellt Editor-Composables für npm-Module (z. B. uptain-pwa-beta) bereit.
 * Abruf in Modul-Komponenten: useNuxtApp().$useSiteSettings / .$getEditorTranslation
 */
import { useSiteSettings } from '~/composables/useSiteSettings';
import { getEditorTranslation } from '~/utils/sortingOptionsHelper';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('useSiteSettings', useSiteSettings);
  nuxtApp.provide('getEditorTranslation', getEditorTranslation);
});
