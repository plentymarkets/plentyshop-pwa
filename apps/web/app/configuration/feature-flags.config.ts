export default {
  /** @description Enables the editable header block (HeaderContainer) */
  enableEditableHeader: true,
  /** @description Enables TipTap rich text editor in block forms */
  enableRichTextEditorV2: process.env?.ENABLE_RICH_TEXT_EDITOR_V2 === '1',
  /** @description Enables the Table of Contents drawer in the editor toolbar */
  enableTableOfContents: process.env?.ENABLE_TABLE_OF_CONTENTS === '1',
};
