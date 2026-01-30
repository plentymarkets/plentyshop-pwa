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
    watch(args.expanded, (val) => (expandedLocal.value = !!val));
    watch(expandedLocal, (val) => args.onUpdateExpanded?.(val));
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
    const editorVal = editor.value;
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

  const textColor = ref('#000000');
  const highlightColor = ref('#ffff00');

  const syncColors = () => {
    const editorVal = editor.value;
    if (!editorVal) return;

    const color = editorVal.getAttributes('textStyle')?.color as string | undefined;
    textColor.value = color ?? '#000000';

    const highlight = editorVal.getAttributes('highlight')?.color as string | undefined;
    highlightColor.value = highlight ?? '#ffff00';
  };

  watch(editor, (editorVal) => {
    if (!editorVal) return;
    editorVal.on('selectionUpdate', syncColors);
    editorVal.on('transaction', syncColors);
    syncColors();
  });

  const setFontColor = (color: string) => {
    const editorVal = editor.value;
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

  const setAlign = (align: RteAlign) => {
    const chain = focusChain();
    if (!chain) return;
    chain.setTextAlign(align).run();
  };

  const isActiveAlign = (activeAlign: RteAlign) => editor.value?.isActive({ textAlign: activeAlign }) ?? false;

  const canUndo = ref(false);
  const canRedo = ref(false);

  const syncHistory = () => {
    const editorVal = editor.value;
    if (!editorVal) return;

    const can = editorVal.can();
    canUndo.value = typeof can.undo === 'function' ? can.undo() : can.chain().undo().run();
    canRedo.value = typeof can.redo === 'function' ? can.redo() : can.chain().redo().run();
  };

  watch(editor, (editorVal) => {
    if (!editorVal) return;
    editorVal.on('transaction', syncHistory);
    syncHistory();
  });

  const undo = () => {
    editor.value?.chain().focus().undo().run();
  };

  const redo = () => {
    editor.value?.chain().focus().redo().run();
  };

  const toggleLink = () => {
    const editorVal = editor.value;
    if (!editorVal) return;

    if (editorVal.isActive('link')) {
      editorVal.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('Enter URL', 'https://');
    if (!url) return;

    editorVal.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const clearFormatting = () => {
    const editorVal = editor.value;
    if (!editorVal) return;
    editorVal.chain().focus().unsetAllMarks().clearNodes().run();
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
