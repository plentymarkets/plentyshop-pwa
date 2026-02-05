<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]"
      @click.self="emit('close')"
    >
      <div class="bg-white w-[90%] m-20 h-[90%] p-6 rounded-lg shadow-xl flex flex-col overflow-hidden">
        <header class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">{{ getEditorTranslation('heading') }}</h2>
          <UiButton variant="tertiary" class="!p-2" @click="emit('close')">
            <SfIconClose />
          </UiButton>
        </header>

        <main class="flex-1 overflow-hidden flex flex-col">
          <div class="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200">
            <EditorRichTextEditorBasicButtons
              :cmd="cmd"
              :is-active="isActive"
              :current-block-type="currentBlockType"
              :on-font-size-change="onFontSizeChange"
              :text-color="textColor"
              :set-font-color="setFontColor"
              :toggle-link="toggleLink"
            />

            <EditorRichTextEditorExtendedButtons
              :cmd="cmd"
              :is-active="isActive"
              :highlight-color="highlightColor"
              :set-highlight-color="setHighlightColor"
              :set-align="setAlign"
              :is-active-align="isActiveAlign"
              :can-undo="canUndo"
              :can-redo="canRedo"
              :undo="undo"
              :redo="redo"
              :clear-formatting="clearFormatting"
            />
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <EditorContent :editor="editor" class="rte__content rte-prose" :style="editorStyle" />
          </div>
        </main>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import type { RteCommand } from '~/composables/useRichTextEditor/types';
import { EditorContent } from '@tiptap/vue-3';
import { SfIconClose } from '@storefront-ui/vue';

defineProps<{
  editor: Editor | undefined;
  editorStyle?: {
    textAlign: globalThis.RteAlign;
    minHeight: string;
  };
  cmd: (name: RteCommand) => void;
  isActive: (name: string) => boolean;
  currentBlockType: RteBlockType;
  onFontSizeChange: (value: string) => void;
  textColor: string;
  highlightColor: string;
  setFontColor: (color: string) => void;
  setHighlightColor: (color: string) => void;
  setAlign: (align: RteAlign) => void;
  isActiveAlign: (align: RteAlign) => boolean;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  toggleLink: () => void;
  clearFormatting: () => void;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<i18n lang="json">
{
  "en": {
    "heading": "Editor"
  },
  "de": {
    "heading": "Editor"
  }
}
</i18n>
