import type { Editor } from '@tiptap/core';
import type { RteAlign } from '../types';

export const setupRichTextEditorAlignment = (
  editor: Ref<Editor | null> | null,
  focusChain: () => ReturnType<Editor['chain']> | undefined,
  textAlignArg?: Ref<RteAlign | undefined>,
) => {
  const setAlign = (align: RteAlign) => {
    const chain = focusChain();
    if (!chain) return;
    chain.setTextAlign(align).run();
  };

  const isActiveAlign = (activeAlign: RteAlign) => editor?.value?.isActive({ textAlign: activeAlign }) ?? false;

  const textAlignStyle = computed(() => ({
    textAlign: textAlignArg?.value ?? 'left',
  }));

  return {
    setAlign,
    isActiveAlign,
    textAlignStyle,
  };
};
