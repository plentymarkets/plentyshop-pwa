<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="emit('close')"
    >
      <div class="bg-white w-[1500px] h-[90%] p-6 rounded-lg shadow-xl flex flex-col overflow-hidden">
        <header class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">Editor</h2>
          <button class="!p-0" @click="emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        </header>

        <main class="flex-1 overflow-hidden flex flex-col">
          <div class="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200">
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

            <EditorRichTextEditorMenuButton
              :active="isActive('blockquote')"
              icon-name="quote"
              @click="cmd('toggleBlockquote')"
            />

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

            <EditorRichTextEditorMenuButton
              :active="isActiveAlign('center')"
              icon-name="alignCenter"
              @click="setAlign('center')"
            />

            <EditorRichTextEditorMenuButton
              :active="isActiveAlign('right')"
              icon-name="alignRight"
              @click="setAlign('right')"
            />

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
          </div>


          <div class="flex-1 overflow-y-auto p-4">
            <EditorContent :editor="editor" class="rte__content rte-prose" />
          </div>
        </main>

        <footer class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="border border-editor-button py-1 px-4 rounded-md flex items-center justify-center text-editor-button"
            @click="emit('close')"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    textAlign?: RteAlign;
  }>(),
  {
    modelValue: '',
    textAlign: 'left',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:expanded', value: boolean): void;
  (e: 'close'): void;
}>();

const {
  editor,
  cmd,
  isActive,
  textColor,
  setFontColor,
  toggleLink,
  currentBlockType,
  onFontSizeChange,
  highlightColor,
  setHighlightColor,
  setAlign,
  isActiveAlign,
  canUndo,
  canRedo,
  undo,
  redo,
  clearFormatting
} = useRichTextEditor({
  modelValue: toRef(props, 'modelValue'),
  onUpdateModelValue: (v) => emit('update:modelValue', v),
});
</script>