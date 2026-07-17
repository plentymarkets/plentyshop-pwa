import { useEditor } from '@tiptap/vue-3';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
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
import { CustomLink } from './helpers/customLinkExtension';
import { FontSize } from './helpers/fontSizeExtension';
import { IconNode } from './helpers/iconExtension';
import { AtomSelectionDecoration } from './helpers/atomSelectionDecoration';
import Placeholder from '@tiptap/extension-placeholder';
import Emoji, { emojis } from '@tiptap/extension-emoji';
import { getMarkRange } from '@tiptap/core';
import { PropertyPlaceholderNode } from './helpers/propertyPlaceholderExtension';
import type { PropertyPlaceholderToken } from './types';

export function useRichTextEditor(args: UseRichTextEditorArgs) {
  const { expandedLocal } = setupRichTextEditorExpansion(args);

  let isReady = false;

  const editor = useEditor({
    content: args.modelValue.value ?? '',
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      CustomLink.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      PropertyPlaceholderNode,
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
      IconNode,
      AtomSelectionDecoration,
      Emoji.extend({ marks: '_' }).configure({
        emojis,
        enableEmoticons: true,
      }),
    ],
    editorProps: {
      transformPastedHTML: (html) => stripInlineFontSizesFromHtml(html),
      handleDOMEvents: {
        mousedown: (view, event) => {
          const target = event.target as HTMLElement | null;
          const anchor = target?.closest('a');

          if (!anchor) return false;

          event.preventDefault();
          event.stopPropagation();

          const linkMark = view.state.schema.marks.link;
          if (!linkMark) return true;

          const pos = view.posAtDOM(anchor.firstChild ?? anchor, 0);
          const safePos = Math.max(1, Math.min(pos, view.state.doc.content.size));
          const $pos = view.state.doc.resolve(safePos);
          const range = getMarkRange($pos, linkMark);

          if (range) {
            editor.value?.chain().focus().setTextSelection(range).run();
          }

          args.onOpenLinkModal?.();

          return true;
        },
      },
    },
    onCreate: () => {
      isReady = true;
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      if (!isReady) return;
      const next = editor.getHTML();
      if (decodeHtmlEntities(next) !== decodeHtmlEntities(args.modelValue.value ?? '')) {
        args.onUpdateModelValue(next);
      }
    },
  });

  watch(args.modelValue, (next = '') => {
    if (!editor.value) {
      return;
    }

    const current = editor.value.getHTML();
    const normalizedWanted = decodeHtmlEntities(next);
    const normalizedCurrent = decodeHtmlEntities(current);

    if (normalizedCurrent !== normalizedWanted) {
      editor.value.commands.setContent(next, { emitUpdate: false });
    }
  });

  onBeforeUnmount(() => editor.value?.destroy());

  const focusChain = () => editor.value?.chain().focus();

  const cmd = (name: RteCommand) => {
    const chain = focusChain();
    if (!chain) {
      return;
    }
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
  const { toggleLink, clearFormatting } = setupRichTextEditorLinksFormatting(
    editor as Ref<Editor | null> | null,
    args.onOpenLinkModal,
  );

  const focus = () => editor.value?.commands.focus();

  const insertIcon = (name: string) => {
    editor.value?.chain().focus().insertIcon(name).run();
  };

  const insertEmoji = (name: string) => {
    editor.value?.chain().focus().setEmoji(name).run();
  };
  const insertPropertyPlaceholders = (tokens: PropertyPlaceholderToken[]) => {
    if (!tokens.length || !editor.value) return;

    const chain = editor.value.chain().focus();
    tokens.forEach(({ token, label, propertyId, kind, cast }, index) => {
      chain.insertPropertyPlaceholder(token, label || formatPropertyPlaceholderLabel(token), {
        propertyId,
        kind,
        cast,
      });
      if (index < tokens.length - 1) {
        chain.setHardBreak();
      }
    });
    chain.run();
  };
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
    insertIcon,
    insertEmoji,
    insertPropertyPlaceholders,
  };
}
