<template>
  <EditorRichTextEditorMenuButton :active="isActive('blockquote')" icon-name="quote" @click="cmd('toggleBlockquote')" />
  <EditorRichTextEditorMenuButton :active="isActive('strike')" icon-name="strike" @click="cmd('toggleStrike')" />

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
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
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
  <EditorRichTextEditorMenuButton
    :active="isActiveAlign('center')"
    icon-name="alignCenter"
    @click="setAlign('center')"
  />
  <EditorRichTextEditorMenuButton :active="isActiveAlign('right')" icon-name="alignRight" @click="setAlign('right')" />
  <EditorRichTextEditorMenuButton :active="isActiveAlign('justify')" icon-name="block" @click="setAlign('justify')" />

  <span class="w-px h-5 bg-gray-200 mx-0.5" />

  <EditorRichTextEditorMenuButton
    :active="isActive('bulletList')"
    icon-name="bulletList"
    @click="cmd('toggleBulletList')"
  />
  <EditorRichTextEditorMenuButton
    :active="isActive('orderedList')"
    icon-name="numberList"
    @click="cmd('toggleOrderedList')"
  />

  <span class="w-px h-5 bg-gray-200 mx-0.5" />

  <EditorRichTextEditorMenuButton icon-name="horizontalRule" @click="cmd('setHorizontalRule')" />
  <EditorRichTextEditorMenuButton data-testid="rte-undo-button" :disabled="!canUndo" icon-name="undo" @click="undo" />
  <EditorRichTextEditorMenuButton data-testid="rte-redo-button" :disabled="!canRedo" icon-name="redo" @click="redo" />
  <EditorRichTextEditorMenuButton icon-name="backspace" @click="clearFormatting" />
</template>

<script setup lang="ts">
import type { RteCommand } from '~/composables/useRichTextEditor/types';

defineProps<{
  cmd: (name: RteCommand) => void;
  isActive: (name: string) => boolean;
  highlightColor: string;
  setHighlightColor: (color: string) => void;
  setAlign: (align: RteAlign) => void;
  isActiveAlign: (align: RteAlign) => boolean;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearFormatting: () => void;
}>();
</script>
