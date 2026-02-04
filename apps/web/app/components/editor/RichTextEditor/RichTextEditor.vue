<template>
  <div class="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200" data-testid="rte-toolbar">
    <select
      class="h-8 pl-2 rounded bg-transparent hover:bg-gray-100 text-sm cursor-pointer font-bold"
      :value="currentBlockType"
      data-testid="rte-font-size"
      @mousedown.stop
      @click.stop
      @change="onFontSizeChange(($event.target as HTMLSelectElement).value)"
    >
      <option value="paragraph" class="font-bold">Normal</option>
      <option value="h1">H1</option>
      <option value="h2">H2</option>
      <option value="h3">H3</option>
    </select>

    <EditorRichTextEditorMenuButton :active="isActive('bold')" icon-name="bold" @click="cmd('toggleBold')"/>

    <EditorRichTextEditorMenuButton :active="isActive('italic')" icon-name="italic" @click="cmd('toggleItalic')"/>

    <EditorRichTextEditorMenuButton :active="isActive('underline')" icon-name="underline" @click="cmd('toggleUnderline')"/>

    <EditorRichTextEditorMenuButton data-testid="rte-link-button" :active="isActive('link')" icon-name="link" @click="toggleLink" />

    <EditorColorPicker
      data-testid="rte-font-color"
      :model-value="textColor"
      dropdown-align="rte"
      @update:model-value="setFontColor($event)"
    >
      <template #trigger="{ color, toggle }">
        <button
          type="button"
          class="flex flex-col items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded"
          @click="toggle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#062633">
            <path d="m246-160 176-464h116l176 464h-117l-38-112H401l-38 112H246Zm176-203h116l-56-166h-4l-56 166Z" />
          </svg>
          <div class="w-6 h-1 rounded" :style="{ backgroundColor: color }" />
        </button>
      </template>
    </EditorColorPicker>

    <button
      v-if="expandable"
      type="button"
      class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100 ml-auto"
      :aria-expanded="expandedLocal"
      data-testid="rte-expand"
      @mousedown.prevent
      @click="expandedLocal = !expandedLocal"
    >
      <span class="inline-block transition-transform duration-150" :class="{ 'rotate-180': expandedLocal }">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#062633">
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
      </span>
    </button>
  </div>

  <div
    v-if="expandable && expandedLocal"
    class="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200"
    data-testid="rte-toolbar-expanded"
  >
    <EditorRichTextEditorMenuButton :active="isActive('blockquote')" icon-name="quote" @click="cmd('toggleBlockquote')" />

    <EditorRichTextEditorMenuButton :active="isActive('strike')" icon-name="strike" @click="cmd('toggleStrike')"/>

    <EditorColorPicker
      data-testid="rte-highlight-color"
      :model-value="highlightColor"
      dropdown-align="ctr"
      @update:model-value="setHighlightColor($event)"
    >
      <template #trigger="{ color, toggle }">
        <button
          type="button"
          class="flex flex-col items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded"
          @click="toggle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path
              d="M544-400 440-504 240-304l104 104 200-200Zm-47-161 104 104 199-199-104-104-199 199Zm-84-28 216 216-229 229q-24 24-56 24t-56-24l-2-2-26 26H60l126-126-2-2q-24-24-24-56t24-56l229-229Zm0 0 227-227q24-24 56-24t56 24l104 104q24 24 24 56t-24 56L629-373 413-589Z"
            />
          </svg>

          <div class="w-6 h-1 rounded" :style="{ backgroundColor: color }" />
        </button>
      </template>
    </EditorColorPicker>

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <EditorRichTextEditorMenuButton :active="isActiveAlign('left')" icon-name="alignLeft" @click="setAlign('left')" />

    <EditorRichTextEditorMenuButton :active="isActiveAlign('center')" icon-name="alignCenter" @click="setAlign('center')" />

    <EditorRichTextEditorMenuButton :active="isActiveAlign('right')" icon-name="alignRight" @click="setAlign('right')" />

    <EditorRichTextEditorMenuButton :active="isActiveAlign('justify')"  icon-name="block" @click="setAlign('justify')" />

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <EditorRichTextEditorMenuButton :active="isActive('bulletList')" icon-name="bulletList" @click="cmd('toggleBulletList')"/>

    <EditorRichTextEditorMenuButton :active="isActive('orderedList')" icon-name="numberList" @click="cmd('toggleOrderedList')"/>

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <EditorRichTextEditorMenuButton icon-name="horizontalRule" @click="cmd('setHorizontalRule')" />

    <EditorRichTextEditorMenuButton data-testid="rte-undo-button" :disabled="!canUndo" icon-name="undo" @click="undo"/>

    <EditorRichTextEditorMenuButton data-testid="rte-redo-button" :disabled="!canRedo" icon-name="redo" @click="redo"/>

    <EditorRichTextEditorMenuButton icon-name="backspace" @click="clearFormatting" />
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