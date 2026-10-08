/**
 * Local-only debug override: seeds the shared `extensions` state so Four Seasons'
 * isExtensionAuthorized check passes without a real backend extension registration.
 * Delete this file before committing/merging.
 */
export default defineNuxtPlugin({
  name: 'debug-four-seasons-extension',
  setup() {
    useState<string[]>('extensions').value = ['@plentymarkets/four-seasons2'];
  },
});
