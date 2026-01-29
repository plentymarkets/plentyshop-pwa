import { useEditor } from '@tiptap/vue-3';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import type { UseRichTextEditorArgs } from '~/composables/useRichTextEditor/types';

export function useRichTextEditor(args: UseRichTextEditorArgs) {
  const expandedLocal = ref<boolean>(args.expanded?.value ?? false);

  if (args.expanded && args.onUpdateExpanded) {
    watch(args.expanded, (v) => (expandedLocal.value = !!v));
    watch(expandedLocal, (v) => args.onUpdateExpanded?.(v));
  }

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
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    onUpdate: ({ editor }: { editor: Editor }) => {
      args.onUpdateModelValue(editor.getHTML());
    },
  });

  watch(args.modelValue, (next) => {
    if (!editor.value) return;
    const wanted = next ?? '';
    const current = editor.value.getHTML();
    if (current !== wanted) {
      editor.value.commands.setContent(wanted, { emitUpdate: false });
    }
  });

  onBeforeUnmount(() => editor.value?.destroy());

  const focusChain = () => editor.value?.chain().focus();

  const cmd = (
    name:
      | 'toggleBold'
      | 'toggleItalic'
      | 'toggleUnderline'
      | 'toggleBlockquote'
      | 'toggleStrike'
      | 'toggleBulletList'
      | 'toggleOrderedList'
      | 'setHorizontalRule',
  ) => {
    const chain = focusChain();
    if (!chain) return;
    chain[name]().run();
  };

  const isActive = (name: string) => editor.value?.isActive(name) ?? false;

  const currentBlockType = computed<RteBlockType>(() => {
    const ed = editor.value;
    if (!ed) return 'paragraph';
    if (ed.isActive('heading', { level: 1 })) return 'h1';
    if (ed.isActive('heading', { level: 2 })) return 'h2';
    if (ed.isActive('heading', { level: 3 })) return 'h3';
    return 'paragraph';
  });

  const onFontSizeChange = (v: string) => {
    const chain = focusChain();
    if (!chain) return;

    if (v === 'h1') chain.toggleHeading({ level: 1 }).run();
    else if (v === 'h2') chain.toggleHeading({ level: 2 }).run();
    else if (v === 'h3') chain.toggleHeading({ level: 3 }).run();
    else chain.setParagraph().run();
  };

  const textColor = ref('#000000');
  const highlightColor = ref('#ffff00');

  const syncColors = () => {
    const ed = editor.value;
    if (!ed) return;

    const c = ed.getAttributes('textStyle')?.color as string | undefined;
    textColor.value = c ?? '#000000';

    const h = ed.getAttributes('highlight')?.color as string | undefined;
    highlightColor.value = h ?? '#ffff00';
  };

  watch(editor, (ed) => {
    if (!ed) return;
    ed.on('selectionUpdate', syncColors);
    ed.on('transaction', syncColors);
    syncColors();
  });

  const setFontColor = (color: string) => {
    const chain = focusChain();
    if (!chain) return;
    chain.setColor(color).run();
    textColor.value = color;
  };

  const setHighlightColor = (color: string) => {
    const chain = focusChain();
    if (!chain) return;
    chain.setHighlight({ color }).run();
    highlightColor.value = color;
  };

  const setAlign = (a: RteAlign) => {
    const chain = focusChain();
    if (!chain) return;
    chain.setTextAlign(a).run();
  };

  const isActiveAlign = (a: RteAlign) => editor.value?.isActive({ textAlign: a }) ?? false;

  const canUndo = ref(false);
  const canRedo = ref(false);

  const syncHistory = () => {
    const ed = editor.value;
    if (!ed) return;

    const can = ed.can();
    canUndo.value = typeof can.undo === 'function' ? can.undo() : can.chain().undo().run();
    canRedo.value = typeof can.redo === 'function' ? can.redo() : can.chain().redo().run();
  };

  watch(editor, (ed) => {
    if (!ed) return;
    ed.on('transaction', syncHistory);
    syncHistory();
  });

  const undo = () => {
    editor.value?.chain().focus().undo().run();
  };

  const redo = () => {
    editor.value?.chain().focus().redo().run();
  };

  const toggleLink = () => {
    const ed = editor.value;
    if (!ed) return;

    if (ed.isActive('link')) {
      ed.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('Enter URL', 'https://');
    if (!url) return;

    ed.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const clearFormatting = () => {
    const ed = editor.value;
    if (!ed) return;
    ed.chain().focus().unsetAllMarks().clearNodes().run();
  };

  const textAlignStyle = computed(() => ({
    textAlign: args.textAlign?.value ?? 'left',
  }));

  const focus = () => editor.value?.commands.focus();

  return {
    editor,
    expandedLocal,
    cmd,
    isActive,
    currentBlockType,
    onFontSizeChange,
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
