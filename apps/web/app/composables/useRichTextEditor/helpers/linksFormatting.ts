import type { Editor } from '@tiptap/core';

export const setupRichTextEditorLinksFormatting = (
  editor: Ref<Editor | null> | null,
  onOpenLinkModal?: () => void,
) => {
  const toggleLink = () => {
    const editorVal = editor?.value;
    if (!editorVal) return;

    if (editorVal.isActive('link')) {
      editorVal.chain().focus().unsetLink().run();
      return;
    }

    onOpenLinkModal?.();
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
