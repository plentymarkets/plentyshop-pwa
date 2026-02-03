import type { Editor } from '@tiptap/core';

export const setupRichTextEditorLinksFormatting = (editor: Ref<Editor | null> | null) => {
  const toggleLink = () => {
    const editorVal = editor?.value;
    if (!editorVal) return;

    if (editorVal.isActive('link')) {
      editorVal.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('Enter URL', 'https://');
    if (!url) return;

    editorVal.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const clearFormatting = () => {
    const editorVal = editor?.value;
    if (!editorVal) return;
    editorVal.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return {
    toggleLink,
    clearFormatting,
  };
};
