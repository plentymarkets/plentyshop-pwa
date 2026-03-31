import { useEditor } from '@tiptap/vue-3';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import type { RteCommand, UseRichTextEditorArgs } from '~/composables/useRichTextEditor/types';
import { setupRichTextEditorExpansion } from './helpers/expansion';
import { setupRichTextEditorBlocks } from './helpers/blocks';
import { setupRichTextEditorColors } from './helpers/colors';
import { setupRichTextEditorAlignment } from './helpers/alignment';
import { setupRichTextEditorHistory } from './helpers/history';
import { setupRichTextEditorLinksFormatting } from './helpers/linksFormatting';
import { stripInlineFontSizesFromHtml } from './helpers/pasteSanitizer';
import { FontSize } from './helpers/fontSizeExtension';
import Placeholder from '@tiptap/extension-placeholder';

export function useRichTextEditor(args: UseRichTextEditorArgs) {
  const { expandedLocal } = setupRichTextEditorExpansion(args);

  const editor = useEditor({
    content: args.modelValue.value ?? '',
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: args.placeholder?.value ?? 'Enter text here...',
      }),
    ],
    editorProps: {
      transformPastedHTML: (html) => {
        return stripInlineFontSizesFromHtml(html);
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      args.onUpdateModelValue(editor.getHTML());
    },
  });

  watch(args.modelValue, (next) => {
    if (!editor.value) return;
    const wanted = next ?? '';
    const current = editor.value.getHTML();

    const normalizedWanted = decodeHtmlEntities(wanted);
    const normalizedCurrent = decodeHtmlEntities(current);

    if (normalizedCurrent !== normalizedWanted) {
      editor.value.commands.setContent(wanted, { emitUpdate: false });
    }
  });

  onBeforeUnmount(() => editor.value?.destroy());

  const focusChain = () => editor.value?.chain().focus();

  const cmd = (name: RteCommand) => {
    const chain = focusChain();
    if (!chain) return;
    chain[name]().run();
  };

  const isActive = (name: string) => editor.value?.isActive(name) ?? false;

  const { currentBlockType, onFontSizeChange } = setupRichTextEditorBlocks(
    editor as Ref<Editor | null> | null,
    focusChain,
  );
  const currentFontSize = computed(() => editor.value?.getAttributes('textStyle')?.fontSize ?? '');

  const setFontSize = (value: string) => {
    const normalizedFontSize = (value ?? '').trim();
    editor.value
      ?.chain()
      .focus()
      .setFontSize(normalizedFontSize || null)
      .run();
  };
  const { textColor, highlightColor, setFontColor, setHighlightColor } = setupRichTextEditorColors(
    editor as Ref<Editor | null> | null,
    focusChain,
  );
  const { setAlign, isActiveAlign, textAlignStyle } = setupRichTextEditorAlignment(
    editor as Ref<Editor | null> | null,
    focusChain,
    args.textAlign,
  );
  const { canUndo, canRedo, undo, redo } = setupRichTextEditorHistory(editor as Ref<Editor | null> | null, focusChain);
  const { toggleLink, clearFormatting } = setupRichTextEditorLinksFormatting(editor as Ref<Editor | null> | null);

  const focus = () => editor.value?.commands.focus();

  return {
    editor,
    expandedLocal,
    cmd,
    isActive,
    currentBlockType,
    onFontSizeChange,
    currentFontSize,
    setFontSize,
    textColor,
    highlightColor,
    setFontColor,
    setHighlightColor,
    setAlign,
    isActiveAlign,
    textAlignStyle,
    canUndo,
    canRedo,
    undo,
    redo,
    toggleLink,
    clearFormatting,
    focus,
  };
}
