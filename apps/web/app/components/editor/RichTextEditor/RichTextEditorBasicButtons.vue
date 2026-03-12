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
    <option value="h4">H4</option>
    <option value="h5">H5</option>
    <option value="h6">H6</option>
  </select>
  <select
    class="h-8 pl-2 rounded bg-transparent hover:bg-gray-100 text-sm cursor-pointer font-bold"
    :value="currentFontSize"
    data-testid="rte-font-size-select"
    @mousedown.stop
    @click.stop
    @change="onTextSizeChange(($event.target as HTMLSelectElement).value)"
  >
    <option value="0.5rem">8px</option>
    <option value="0.625rem">10px</option>
    <option value="0.75rem">12px</option>
    <option value="0.875rem">14px</option>
    <option value="1rem">16px (Default)</option>
    <option value="1.125rem">18px</option>
    <option value="1.25rem">20px</option>
    <option value="1.5rem">24px</option>
    <option value="1.875rem">30px</option>
    <option value="2.25rem">36px</option>
    <option value="3rem">48px</option>
    <option value="3.75rem">60px</option>
    <option value="4.5rem">72px</option>
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
  currentFontSize: string;
  onTextSizeChange: (value: string) => void;
  textColor: string;
  setFontColor: (color: string) => void;
  toggleLink: () => void;
}>();
</script>
