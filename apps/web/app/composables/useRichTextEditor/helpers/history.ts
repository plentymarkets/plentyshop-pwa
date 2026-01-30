import type { Editor } from '@tiptap/core';

export const setupRichTextEditorHistory = (
  editor: Ref<Editor | null> | null,
  focusChain: () => ReturnType<Editor['chain']> | undefined,
) => {
  const canUndo = ref(false);
  const canRedo = ref(false);

  const syncHistory = () => {
    const editorVal = editor?.value;
    if (!editorVal) return;

    const can = editorVal.can();
    canUndo.value = typeof can.undo === 'function' ? can.undo() : can.chain().undo().run();
    canRedo.value = typeof can.redo === 'function' ? can.redo() : can.chain().redo().run();
  };

  if (editor) {
    watch(editor, (editorVal) => {
      if (!editorVal) return;
      editorVal.on('transaction', syncHistory);
      syncHistory();
    });
  }

  const undo = () => {
    const chain = focusChain();
    if (!chain) return;
    chain.undo().run();
  };

  const redo = () => {
    const chain = focusChain();
    if (!chain) return;
    chain.redo().run();
  };

  return {
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
