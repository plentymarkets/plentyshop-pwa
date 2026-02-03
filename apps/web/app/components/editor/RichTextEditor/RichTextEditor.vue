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

    <EditorRichTextEditorMenuButton :active="isActive('bold')" @click="cmd('toggleBold')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :active="isActive('italic')" @click="cmd('toggleItalic')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z" />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :active="isActive('underline')" @click="cmd('toggleUnderline')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :active="isActive('link')" @click="toggleLink">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M318-120q-82 0-140-58t-58-140q0-40 15-76t43-64l134-133 56 56-134 134q-17 17-25.5 38.5T200-318q0 49 34.5 83.5T318-200q23 0 45-8.5t39-25.5l133-134 57 57-134 133q-28 28-64 43t-76 15Zm79-220-57-57 223-223 57 57-223 223Zm251-28-56-57 134-133q17-17 25-38t8-44q0-50-34-85t-84-35q-23 0-44.5 8.5T558-726L425-592l-57-56 134-134q28-28 64-43t76-15q82 0 139.5 58T839-641q0 39-14.5 75T782-502L648-368Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

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

    <EditorRichTextEditorMenuButton :active="isActiveAlign('left')" @click="setAlign('left')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :active="isActiveAlign('center')" @click="setAlign('center')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :active="isActiveAlign('right')" @click="setAlign('right')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :active="isActiveAlign('justify')" @click="setAlign('justify')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M120-120v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <EditorRichTextEditorMenuButton :active="isActive('bulletList')" @click="cmd('toggleBulletList')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :active="isActive('orderedList')" @click="cmd('toggleOrderedList')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <span class="w-px h-5 bg-gray-200 mx-0.5" />

    <EditorRichTextEditorMenuButton @click="cmd('setHorizontalRule')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M160-440v-80h640v80H160Z" />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :disabled="!canUndo" @click="undo">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton :disabled="!canRedo" @click="redo">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>

    <EditorRichTextEditorMenuButton @click="clearFormatting">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path
          d="m456-320 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 160q-19 0-36-8.5T296-192L80-480l216-288q11-15 28-23.5t36-8.5h440q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H360ZM180-480l180 240h440v-480H360L180-480Zm400 0Z"
        />
      </svg>
    </EditorRichTextEditorMenuButton>
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
