<template>
  <div class="flex items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200" data-testid="rte-toolbar">
    <select
      class="h-8 border border-gray-200 rounded px-2 bg-white text-sm"
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
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('bold') }"
      @mousedown.prevent
      @click="cmd('toggleBold')"
    >
      <b>B</b>
    </button>

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('italic') }"
      @mousedown.prevent
      @click="cmd('toggleItalic')"
    >
      <i>I</i>
    </button>

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('underline') }"
      @mousedown.prevent
      @click="cmd('toggleUnderline')"
    >
      <span class="underline">U</span>
    </button>

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('link') }"
      @mousedown.prevent
      @click="toggleLink"
    >
      🔗
    </button>

    <button
      v-if="expandable"
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100 ml-auto"
      :aria-expanded="expandedLocal"
      data-testid="rte-expand"
      @mousedown.prevent
      @click="expandedLocal = !expandedLocal"
    >
      <span class="inline-block transition-transform duration-150" :class="{ 'rotate-180': expandedLocal }">▾</span>
    </button>
  </div>

  <div
    v-if="expandable && expandedLocal"
    class="flex items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200"
    data-testid="rte-toolbar-expanded"
  >
    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('blockquote') }"
      @mousedown.prevent
      @click="cmd('toggleBlockquote')"
    >
      ❝
    </button>

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('strike') }"
      @mousedown.prevent
      @click="cmd('toggleStrike')"
    >
      S
    </button>

    <label class="inline-flex items-center" @mousedown.stop @click.stop>
      <span class="sr-only">Highlight color</span>
      <input
        type="color"
        class="w-9 h-8 border border-gray-200 rounded bg-white p-0.5 cursor-pointer"
        data-testid="rte-highlight-color"
        :value="highlightColor"
        @input="setHighlightColor(($event.target as HTMLInputElement).value)"
      />
    </label>

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActiveAlign('left') }"
      @mousedown.prevent
      @click="setAlign('left')"
    >
      ⬅
    </button>
    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActiveAlign('center') }"
      @mousedown.prevent
      @click="setAlign('center')"
    >
      ⬌
    </button>
    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActiveAlign('right') }"
      @mousedown.prevent
      @click="setAlign('right')"
    >
      ➡
    </button>
    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActiveAlign('justify') }"
      @mousedown.prevent
      @click="setAlign('justify')"
    >
      ☰
    </button>

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('bulletList') }"
      @mousedown.prevent
      @click="cmd('toggleBulletList')"
    >
      ••
    </button>
    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :class="{ 'bg-gray-200 border-gray-300': isActive('orderedList') }"
      @mousedown.prevent
      @click="cmd('toggleOrderedList')"
    >
      1.
    </button>
    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      @mousedown.prevent
      @click="cmd('setHorizontalRule')"
    >
      ─
    </button>

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :disabled="!canUndo"
      @mousedown.prevent
      @click="undo"
    >
      ↶
    </button>
    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
      :disabled="!canRedo"
      @mousedown.prevent
      @click="redo"
    >
      ↷
    </button>

    <button
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100 ml-auto"
      @mousedown.prevent
      @click="clearFormatting"
    >
      ⌫
    </button>
  </div>

  <div class="p-2.5" data-testid="rte-editor" @mousedown="editor?.chain().focus().run()">
    <EditorContent :editor="editor" class="rte__content rte-prose" :style="editorStyle" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    minHeight?: number;
    expandable?: boolean;
    expanded?: boolean;
    textAlign?: RteAlign;
  }>(),
  {
    modelValue: '',
    minHeight: 120,
    expandable: true,
    expanded: false,
    textAlign: 'left',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:expanded', value: boolean): void;
}>();


const {
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
} = useRichTextEditor({
  modelValue: toRef(props, 'modelValue'),
  onUpdateModelValue: (v) => emit('update:modelValue', v),

  expanded: toRef(props, 'expanded'),
  onUpdateExpanded: (v) => emit('update:expanded', v),

  textAlign: toRef(props, 'textAlign'),
});

defineExpose({ editor, focus, clearFormatting, undo, redo });

const editorStyle = computed(() => ({
  minHeight: `${props.minHeight}px`,
  ...textAlignStyle.value,
}));
</script>
