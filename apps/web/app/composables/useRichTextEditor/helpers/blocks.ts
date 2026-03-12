import type { Editor } from '@tiptap/core';
import type { RteBlockType, HeadingLevel } from '~/composables/useRichTextEditor/types';

export const setupRichTextEditorBlocks = (
  editor: Ref<Editor | null> | null,
  focusChain: () => ReturnType<Editor['chain']> | undefined,
) => {
  const currentBlockType = computed<RteBlockType>(() => {
    const editorInstance = editor?.value;
    if (!editorInstance) return 'paragraph';

    for (const headingLevel of [1, 2, 3, 4, 5, 6] as const) {
      if (editorInstance.isActive('heading', { level: headingLevel })) {
        return `h${headingLevel}` as RteBlockType;
      }
    }

    return 'paragraph';
  });

  const onFontSizeChange = (value: string) => {
    const chain = focusChain();
    if (!chain) return;

    if (value === 'paragraph') {
      chain.setParagraph().run();
      return;
    }

    const match = /^h([1-6])$/.exec(value);
    if (match) {
      const level = Number(match[1]) as HeadingLevel;
      chain.toggleHeading({ level }).run();
      return;
    }

    chain.setParagraph().run();
  };

  return { currentBlockType, onFontSizeChange };
};
