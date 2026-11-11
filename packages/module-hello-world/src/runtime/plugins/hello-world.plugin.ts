import { defineExtensionPlugin } from '#imports';
import extensionConfig from '../extension.config';

// Only runs when the extension is activated for the shop.
export default defineExtensionPlugin(extensionConfig.name, () => {
  // TODO: add your extension logic
});
