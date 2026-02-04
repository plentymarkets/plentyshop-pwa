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

          <EditorRichTextEditorMenuButton data-testid="rte-link-button" :active="isActive('link')" @click="toggleLink">
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
  toggleLink
} = useRichTextEditor({
  modelValue: toRef(props, 'modelValue'),
  onUpdateModelValue: (v) => emit('update:modelValue', v),

  textAlign: toRef(props, 'textAlign'),
});
</script>