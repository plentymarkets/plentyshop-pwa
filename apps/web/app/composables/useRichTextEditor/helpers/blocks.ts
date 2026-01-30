import type { Editor } from '@tiptap/core';

export const setupRichTextEditorBlocks = (
  editor: Ref<Editor | null> | null,
  focusChain: () => ReturnType<Editor['chain']> | undefined,
) => {
  const currentBlockType = computed<RteBlockType>(() => {
    const editorVal = editor?.value;
    if (!editorVal) return 'paragraph';
    if (editorVal.isActive('heading', { level: 1 })) return 'h1';
    if (editorVal.isActive('heading', { level: 2 })) return 'h2';
    if (editorVal.isActive('heading', { level: 3 })) return 'h3';
    return 'paragraph';
  });

  const onFontSizeChange = (value: string) => {
    const chain = focusChain();
    if (!chain) return;

    if (value === 'h1') chain.toggleHeading({ level: 1 }).run();
    else if (value === 'h2') chain.toggleHeading({ level: 2 }).run();
    else if (value === 'h3') chain.toggleHeading({ level: 3 }).run();
    else chain.setParagraph().run();
  };

  return {
    currentBlockType,
    onFontSizeChange,
  };
};
