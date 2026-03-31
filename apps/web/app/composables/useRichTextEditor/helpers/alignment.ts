import type { Editor } from '@tiptap/core';
import type { RteAlign } from '../types';

export const setupRichTextEditorAlignment = (
  editor: Ref<Editor | null> | null,
  focusChain: () => ReturnType<Editor['chain']> | undefined,
  textAlignArg?: Ref<RteAlign | undefined>,
  editorFocused?: Ref<boolean>,
) => {
  const setAlign = (align: RteAlign) => {
    const chain = focusChain();
    if (!chain) return;
    chain.setTextAlign(align).run();
  };

  const activeAlign = computed<RteAlign | false>(() => {
    const editorInstance = editor?.value;
    const fallback = textAlignArg?.value ?? 'left';
    if (!editorInstance) return false;
    if (!editorFocused?.value) return false;

    for (const align of ['left', 'center', 'right', 'justify'] as RteAlign[]) {
      if (editorInstance.isActive({ textAlign: align })) return align;
    }

    return fallback;
  });

  const isActiveAlign = (align: RteAlign) => activeAlign.value === align;

  const textAlignStyle = computed(() => ({
    textAlign: textAlignArg?.value ?? 'left',
  }));

  return {
    setAlign,
    isActiveAlign,
    textAlignStyle,
  };
};