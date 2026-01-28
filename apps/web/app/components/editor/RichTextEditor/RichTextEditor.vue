<template>
  <div class="rte__toolbar" data-testid="rte-toolbar">
    <!-- Font size -->
    <select
      class="rte__select"
      :value="currentBlockType"
      data-testid="rte-font-size"
      @mousedown.stop
      @click.stop
      @change="onFontSizeChange(($event.target as HTMLSelectElement).value)"
    >
      <option value="paragraph">Normal</option>
      <option value="h1">H1</option>
      <option value="h2">H2</option>
      <option value="h3">H3</option>
    </select>

    <EditorColorPicker :model-value="textColor" @update:model-value="setFontColor($event)" />

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('bold') }"
      @mousedown.prevent
      @click="cmd('toggleBold')"
    >
      <b>B</b>
    </button>

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('italic') }"
      @mousedown.prevent
      @click="cmd('toggleItalic')"
    >
      <i>I</i>
    </button>

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('underline') }"
      @mousedown.prevent
      @click="cmd('toggleUnderline')"
    >
      <span style="text-decoration: underline">U</span>
    </button>

    <button type="button" class="rte__btn" :class="{ active: isActive('link') }" @mousedown.prevent @click="toggleLink">
      🔗
    </button>

    <button
      v-if="expandable"
      type="button"
      class="rte__btn ml-auto"
      :aria-expanded="expandedLocal"
      data-testid="rte-expand"
      @mousedown.prevent
      @click="expandedLocal = !expandedLocal"
    >
      <span class="chev" :class="{ up: expandedLocal }">▾</span>
    </button>
  </div>

  <!-- Expanded toolbar -->
  <div
    v-if="expandable && expandedLocal"
    class="rte__toolbar rte__toolbar--expanded"
    data-testid="rte-toolbar-expanded"
  >
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('blockquote') }"
      @mousedown.prevent
      @click="cmd('toggleBlockquote')"
    >
      ❝
    </button>

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('strike') }"
      @mousedown.prevent
      @click="cmd('toggleStrike')"
    >
      S
    </button>

    <label class="rte__color-wrap" @mousedown.stop @click.stop>
      <span class="sr-only">Highlight color</span>
      <input
        type="color"
        class="rte__color"
        data-testid="rte-highlight-color"
        :value="highlightColor"
        @input="setHighlightColor(($event.target as HTMLInputElement).value)"
      />
    </label>

    <span class="rte__split" />

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('left') }"
      @mousedown.prevent
      @click="setAlign('left')"
    >
      ⬅
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('center') }"
      @mousedown.prevent
      @click="setAlign('center')"
    >
      ⬌
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('right') }"
      @mousedown.prevent
      @click="setAlign('right')"
    >
      ➡
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActiveAlign('justify') }"
      @mousedown.prevent
      @click="setAlign('justify')"
    >
      ☰
    </button>

    <span class="rte__split" />

    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('bulletList') }"
      @mousedown.prevent
      @click="cmd('toggleBulletList')"
    >
      ••
    </button>
    <button
      type="button"
      class="rte__btn"
      :class="{ active: isActive('orderedList') }"
      @mousedown.prevent
      @click="cmd('toggleOrderedList')"
    >
      1.
    </button>
    <button type="button" class="rte__btn" @mousedown.prevent @click="cmd('setHorizontalRule')">─</button>

    <span class="rte__split" />

    <button type="button" class="rte__btn" :disabled="!canUndo" @mousedown.prevent @click="undo">↶</button>
    <button type="button" class="rte__btn" :disabled="!canRedo" @mousedown.prevent @click="redo">↷</button>

    <button type="button" class="rte__btn ml-auto" @mousedown.prevent @click="clearFormatting">⌫</button>
  </div>

  <!-- Editor -->
  <div class="rte__body" data-testid="rte-editor" @mousedown="editor?.chain().focus().run()">
    <EditorContent :editor="editor" class="rte__content" :style="{ minHeight: `${minHeight}px` }" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import type { Editor } from '@tiptap/core';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
const props = withDefaults(
  defineProps<{
    modelValue: string;
    minHeight?: number;
    expandable?: boolean;
    expanded?: boolean;
  }>(),
  {
    modelValue: '',
    minHeight: 120,
    expandable: true,
    expanded: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'update:expanded', v: boolean): void;
}>();

const expandedLocal = ref(props.expanded);
watch(
  () => props.expanded,
  (v) => (expandedLocal.value = v),
);
watch(expandedLocal, (v) => emit('update:expanded', v));

const editor = useEditor({
  content: props.modelValue ?? '',
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
    emit('update:modelValue', editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (next) => {
    if (!editor.value) return;
    const wanted = next ?? '';
    const current = editor.value.getHTML();
    if (current !== wanted) editor.value.commands.setContent(wanted, { emitUpdate: false });
  },
);

onBeforeUnmount(() => editor.value?.destroy());

function focusChain() {
  return editor.value?.chain().focus();
}

function cmd(
  name:
    | 'toggleBold'
    | 'toggleItalic'
    | 'toggleUnderline'
    | 'toggleBlockquote'
    | 'toggleStrike'
    | 'toggleBulletList'
    | 'toggleOrderedList'
    | 'setHorizontalRule',
) {
  const chain = focusChain();
  if (!chain) return;

  chain[name]().run();
}

function isActive(name: string) {
  return editor.value?.isActive(name) ?? false;
}

/** --- Font size --- */
const currentBlockType = computed<'paragraph' | 'h1' | 'h2' | 'h3'>(() => {
  const ed = editor.value;
  if (!ed) return 'paragraph';
  if (ed.isActive('heading', { level: 1 })) return 'h1';
  if (ed.isActive('heading', { level: 2 })) return 'h2';
  if (ed.isActive('heading', { level: 3 })) return 'h3';
  return 'paragraph';
});

function onFontSizeChange(v: string) {
  const chain = focusChain();
  if (!chain) return;

  if (v === 'h1') chain.toggleHeading({ level: 1 }).run();
  else if (v === 'h2') chain.toggleHeading({ level: 2 }).run();
  else if (v === 'h3') chain.toggleHeading({ level: 3 }).run();
  else chain.setParagraph().run();
}

const THEME_PRIMARY_TOKEN = '__theme_primary__';
const THEME_SECONDARY_TOKEN = '__theme_secondary__';
const THEME_PRIMARY_COLOR = 'rgb(var(--colors-2-primary-500))';
const THEME_SECONDARY_COLOR = 'rgb(var(--colors-2-secondary-500))';

const textColor = ref('#000000');
const highlightColor = ref('#ffff00');

const { getSetting: getPrimaryColorSetting } = useSiteSettings('primaryColor');
const { getSetting: getSecondaryColorSetting } = useSiteSettings('secondaryColor');

const primaryHexColor = computed(() => (getPrimaryColorSetting() as string) || '#000000');
const secondaryHexColor = computed(() => (getSecondaryColorSetting() as string) || '#000000');

function mapEditorColorToUi(color: string | undefined): string {
  if (!color) return '#000000';
  if (color === THEME_PRIMARY_COLOR) return primaryHexColor.value;
  if (color === THEME_SECONDARY_COLOR) return secondaryHexColor.value;
  return color;
}

function syncColors() {
  const ed = editor.value;
  if (!ed) return;

  const c = ed.getAttributes('textStyle')?.color as string | undefined;
  textColor.value = mapEditorColorToUi(c);

  const h = ed.getAttributes('highlight')?.color as string | undefined;
  highlightColor.value = h ?? '#ffff00';
}

watch(editor, (ed) => {
  if (!ed) return;
  ed.on('selectionUpdate', syncColors);
  ed.on('transaction', syncColors);
  syncColors();
});

function setFontColor(color: string) {
  const ed = editor.value;
  if (!ed) return;

  if (color === THEME_PRIMARY_TOKEN) {
    ed.chain().setColor(THEME_PRIMARY_COLOR).run();
    textColor.value = primaryHexColor.value;
    return;
  }

  if (color === THEME_SECONDARY_TOKEN) {
    ed.chain().setColor(THEME_SECONDARY_COLOR).run();
    textColor.value = secondaryHexColor.value;
    return;
  }

  ed.chain().setColor(color).run();
  textColor.value = color;
}

function setHighlightColor(color: string) {
  const ed = editor.value;
  if (!ed) return;
  ed.chain().setHighlight({ color }).run();
  highlightColor.value = color;
}

/** --- Align --- */
type Align = 'left' | 'center' | 'right' | 'justify';

function setAlign(a: Align) {
  const chain = focusChain();
  if (!chain) return;
  chain.setTextAlign(a).run();
}

function isActiveAlign(a: Align) {
  return editor.value?.isActive({ textAlign: a }) ?? false;
}

/** --- History --- */
const canUndo = computed(() => editor.value?.can().chain().focus().undo().run() ?? false);
const canRedo = computed(() => editor.value?.can().chain().focus().redo().run() ?? false);

function undo() {
  editor.value?.chain().focus().undo().run();
}
function redo() {
  editor.value?.chain().focus().redo().run();
}

/** --- Link --- */
function toggleLink() {
  const ed = editor.value;
  if (!ed) return;

  // if active, remove
  if (ed.isActive('link')) {
    ed.chain().focus().unsetLink().run();
    return;
  }

  // selection required
  const url = window.prompt('Enter URL', 'https://');
  if (!url) return;

  ed.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

/** --- Clear --- */
function clearFormatting() {
  const ed = editor.value;
  if (!ed) return;
  ed.chain().focus().unsetAllMarks().clearNodes().run();
}

defineExpose({
  editor,
  focus: () => editor.value?.commands.focus(),
  clearFormatting,
  undo,
  redo,
});
</script>

<style scoped>
.rte {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.rte__toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.rte__toolbar--expanded {
  border-top: 1px solid #dee2e6;
  border-bottom: 0;
}

.rte__select {
  height: 32px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0 8px;
  background: white;
  font-size: 13px;
}

.rte__color-wrap {
  display: inline-flex;
  align-items: center;
}

.rte__color {
  width: 38px;
  height: 32px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  padding: 2px;
  cursor: pointer;
}

.rte__btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
}

.rte__btn:hover {
  background: #e9ecef;
}

.rte__btn.active {
  background: #dee2e6;
  border-color: #ced4da;
}

.rte__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rte__body {
  padding: 8px 10px;
}

.rte__content :deep(.ProseMirror) {
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.rte__content :deep(.ProseMirror p) {
  margin: 6px 0;
}

.ml-auto {
  margin-left: auto;
}

.rte__split {
  width: 1px;
  height: 22px;
  background: #dee2e6;
  margin: 0 2px;
}

.chev {
  display: inline-block;
  transition: transform 150ms ease;
}
.chev.up {
  transform: rotate(180deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.rte__content :deep(.ProseMirror h1) {
  font-size: 1.75rem;
  line-height: 2.1rem;
  margin: 10px 0;
  font-weight: 700;
}

.rte__content :deep(.ProseMirror h2) {
  font-size: 1.5rem;
  line-height: 1.9rem;
  margin: 10px 0;
  font-weight: 700;
}

.rte__content :deep(.ProseMirror h3) {
  font-size: 1.25rem;
  line-height: 1.65rem;
  margin: 8px 0;
  font-weight: 600;
}

.rte__content :deep(.ProseMirror p) {
  font-size: 14px;
  line-height: 1.5;
}
.rte__content :deep(.ProseMirror blockquote) {
  border-left: 3px solid #dee2e6;
  padding-left: 12px;
  margin: 10px 0;
  color: #495057;
}

.rte__content :deep(.ProseMirror ul),
.rte__content :deep(.ProseMirror ol) {
  padding-left: 1.25rem;
  margin: 8px 0;
}

.rte__content :deep(.ProseMirror li) {
  margin: 4px 0;
}

.rte__content :deep(.ProseMirror ul) {
  list-style: disc;
}

.rte__content :deep(.ProseMirror ol) {
  list-style: decimal;
}
</style>
