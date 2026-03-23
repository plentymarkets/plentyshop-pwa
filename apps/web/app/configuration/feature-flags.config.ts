export default {
  /** @description Enables the editable header block (HeaderContainer) */
  enableEditableHeader: process.env?.ENABLE_EDITABLE_HEADER === '1',
  /** @description Enables TipTap rich text editor in block forms */
  enableRichTextEditorV2: process.env?.ENABLE_RICH_TEXT_EDITOR_V2 === '1',
  /** @description Enables the Table of Contents drawer in the editor toolbar */
  enableTableOfContents: process.env?.ENABLE_TABLE_OF_CONTENTS === '1',
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
