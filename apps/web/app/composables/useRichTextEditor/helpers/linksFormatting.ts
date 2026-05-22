import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';

const isLinkActiveOnAtom = (editor: Editor): boolean => {
  const { selection } = editor.state;
  if (!(selection instanceof NodeSelection)) return false;
  return selection.node.marks.some((m) => m.type.name === 'link');
};

export const setupRichTextEditorLinksFormatting = (editor: Ref<Editor | null> | null, onOpenLinkModal?: () => void) => {
  const toggleLink = () => {
    const editorVal = editor?.value;
    if (!editorVal) return;

    if (editorVal.isActive('link') || isLinkActiveOnAtom(editorVal)) {
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
