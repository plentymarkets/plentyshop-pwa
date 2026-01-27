export default {
  enableProductEditing: process.env?.ENABLE_PRODUCT_EDITING === '1',
  enableTemplateReset: process.env?.ENABLE_TEMPLATE_RESET === '1',
  enableRichTextEditorV2: process.env?.ENABLE_RICH_TEXT_EDITOR_V2 === '1',
};
