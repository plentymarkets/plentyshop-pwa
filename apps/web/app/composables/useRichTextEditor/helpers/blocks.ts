import type { Editor } from '@tiptap/core';
import { RTE_FOOTER_BLOCK_TYPE, RTE_FOOTER_HEADING_VARIANT } from '../constants';
export const setupRichTextEditorBlocks = (
  editor: Ref<Editor | null> | null,
  focusChain: () => ReturnType<Editor['chain']> | undefined,
) => {
  const currentBlockType = computed<RteBlockType>(() => {
    const editorInstance = editor?.value;
    if (!editorInstance) return 'paragraph';

    if (editorInstance.isActive('heading', { level: 2, variant: RTE_FOOTER_HEADING_VARIANT })) {
      return RTE_FOOTER_BLOCK_TYPE;
    }

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

    if (value === RTE_FOOTER_BLOCK_TYPE) {
      chain.setHeading({ level: 2 }).updateAttributes('heading', { variant: RTE_FOOTER_HEADING_VARIANT }).run();
      return;
    }

    const match = /^h([1-6])$/.exec(value);
    if (match) {
      const level = Number(match[1]) as HeadingLevel;
      chain.setHeading({ level }).updateAttributes('heading', { variant: null }).run();
      return;
    }

    chain.setParagraph().run();
  };

  return { currentBlockType, onFontSizeChange };
};
