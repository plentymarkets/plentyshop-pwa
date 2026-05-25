export default {
  /** @description Enables the new popover for adding blocks & presets  */
  enableAddBlockPopover: true,
  /** @description Enables the new MultiGrid editor with visual column resizing, row management and free-space display. */
  enableMultiGridEditor: true,
  /** @description Enables quick-add pills in structure block forms (Header, Footer, MultiGrid) */
  enableQuickAdd: true,
  /** @description Unleash feature flag configuration */
  unleash: {
    /** @description Unleash frontend API URL */
    url: process.env?.UNLEASH_URL ?? '',
    /** @description Unleash frontend API client key */
    clientKey: process.env?.UNLEASH_CLIENT_KEY ?? '',
    /** @description Application name to identify this app in Unleash */
    appName: process.env?.UNLEASH_APP_NAME ?? 'plentyshop-pwa',
    /** @description Polling interval in seconds for flag updates */
    refreshInterval: Number(process.env?.UNLEASH_REFRESH_INTERVAL ?? 15),
    /**
     * @description JSON string of mock flags used when UNLEASH_URL is not set.
     * For local development without a real Unleash instance.
     * @example UNLEASH_MOCK_FLAGS='{"new-feature-enabled":true,"dark-mode":false}'
     */
    mockFlags: process.env?.UNLEASH_MOCK_FLAGS ?? '',
  },
};
