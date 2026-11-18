/**
 * @description Read-only runtime configuration. These values are never set via the editor — there is no
 * backend-overridable default to track, so they stay out of settings.config.ts and useSiteSettings().
 */
export default {
  validateReturnReasons: process.env.VALIDATE_RETURN_REASONS === '1',
  enableQuickCheckoutTimer: process.env.ENABLE_QUICK_CHECKOUT_TIMER === '1',
  useTagsOnCategoryPage: process.env.USE_TAGS_ON_CATEGORY_PAGE === '1',
  isPreview: false,
  showConfigurationDrawer: process.env.SHOW_CONFIGURATION_DRAWER === '1',
  defaultItemsPerPage: Number(process.env.DEFAULT_FEEDBACK_ITEMS_PER_PAGE ?? 10),
  passwordMinLength: Number(process.env.PASSWORD_MIN_LENGTH ?? 8),
  passwordMaxLength: Number(process.env.PASSWORD_MAX_LENGTH ?? 64),
  storename: process.env.NAME || 'PlentyONE GmbH',
  customAssetsSafeMode: process.env.NUXT_PUBLIC_CUSTOM_ASSETS_SAFE_MODE === 'true',
};
