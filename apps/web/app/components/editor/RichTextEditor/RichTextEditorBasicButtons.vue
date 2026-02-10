<template>
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

  <EditorRichTextEditorMenuButton :active="isActive('bold')" icon-name="bold" @click="cmd('toggleBold')" />
  <EditorRichTextEditorMenuButton :active="isActive('italic')" icon-name="italic" @click="cmd('toggleItalic')" />
  <EditorRichTextEditorMenuButton
    :active="isActive('underline')"
    icon-name="underline"
    @click="cmd('toggleUnderline')"
  />
  <EditorRichTextEditorMenuButton
    data-testid="rte-link-button"
    :active="isActive('link')"
    icon-name="link"
    @click="toggleLink"
  />

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
</template>

<script setup lang="ts">
import type { RteCommand } from '~/composables/useRichTextEditor/types';

defineProps<{
  cmd: (name: RteCommand) => void;
  isActive: (name: string) => boolean;
  currentBlockType: RteBlockType;
  onFontSizeChange: (value: string) => void;
  textColor: string;
  setFontColor: (color: string) => void;
  toggleLink: () => void;
}>();
</script>
