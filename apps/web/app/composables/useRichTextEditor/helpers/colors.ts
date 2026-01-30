import type { Editor } from '@tiptap/core';

export const setupRichTextEditorColors = (
  editor: Ref<Editor | null> | null,
  focusChain: () => ReturnType<Editor['chain']> | undefined,
) => {
  const textColor = ref('#000000');
  const highlightColor = ref('#ffff00');

  const syncColors = () => {
    const editorVal = editor?.value;
    if (!editorVal) return;

    const color = editorVal.getAttributes('textStyle')?.color as string | undefined;
    textColor.value = color ?? '#000000';

    const highlight = editorVal.getAttributes('highlight')?.color as string | undefined;
    highlightColor.value = highlight ?? '#ffff00';
  };

  if (editor) {
    watch(editor, (editorVal) => {
      if (!editorVal) return;
      editorVal.on('selectionUpdate', syncColors);
      editorVal.on('transaction', syncColors);
      syncColors();
    });
  }

  const setFontColor = (color: string) => {
    const editorVal = editor?.value;
    if (!editorVal) return;
    editorVal.chain().setColor(color).run();
    textColor.value = color;
  };

  const setHighlightColor = (color: string) => {
    const chain = focusChain();
    if (!chain) return;
    chain.setHighlight({ color }).run();
    highlightColor.value = color;
  };

  return {
    textColor,
    highlightColor,
    setFontColor,
    setHighlightColor,
  };
}
