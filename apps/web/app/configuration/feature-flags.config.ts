export default {
  /** @description Enables TipTap rich text editor in block forms */
  enableRichTextEditorV2: process.env?.ENABLE_RICH_TEXT_EDITOR_V2 === '1',
  /** @description Enables the new URL scheme for Callisto links */
  enableCallistoUrlScheme: process.env?.ENABLE_CALLISTO_URL_SCHEME === '1',
};
