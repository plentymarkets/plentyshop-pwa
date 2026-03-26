export default {
  /** @description Enables the editable header block (HeaderContainer) */
  enableEditableHeader: process.env?.ENABLE_EDITABLE_HEADER === '1',
  /** @description Enables TipTap rich text editor in block forms */
  enableRichTextEditorV2: process.env?.ENABLE_RICH_TEXT_EDITOR_V2 === '1',
};
