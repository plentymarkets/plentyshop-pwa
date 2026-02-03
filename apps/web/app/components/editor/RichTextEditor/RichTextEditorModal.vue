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
          <EditorRichTextEditorToolbar
            v-model:expanded-local="expandedLocal"
            :expandable="true"
            :current-block-type="currentBlockType"
            :text-color="textColor"
            :highlight-color="highlightColor"
            :can-undo="canUndo"
            :can-redo="canRedo"
            :is-active="isActive"
            :is-active-align="isActiveAlign"
            :cmd="cmd"
            :on-font-size-change="onFontSizeChange"
            :set-font-color="setFontColor"
            :set-highlight-color="setHighlightColor"
            :set-align="setAlign"
            :undo="undo"
            :redo="redo"
            :toggle-link="toggleLink"
            :clear-formatting="clearFormatting"
          />

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
import type { Editor } from '@tiptap/vue-3';

const props = defineProps<{
  editor: Editor | undefined;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const expandedLocal = ref(false);

const isActive = (name: string) => props.editor?.isActive(name) || false;
const isActiveAlign = (align: RteAlign) => props.editor?.isActive({ textAlign: align }) || false;

const currentBlockType = computed(() => {
  if (!props.editor) return 'paragraph';
  if (props.editor.isActive('heading', { level: 1 })) return 'h1';
  if (props.editor.isActive('heading', { level: 2 })) return 'h2';
  if (props.editor.isActive('heading', { level: 3 })) return 'h3';
  return 'paragraph';
});

const textColor = computed(() => props.editor?.getAttributes('textStyle').color || '#000000');
const highlightColor = computed(() => props.editor?.getAttributes('highlight').color || '#ffff00');

const canUndo = computed(() => props.editor?.can().undo() || false);
const canRedo = computed(() => props.editor?.can().redo() || false);

const cmd = (command: 'toggleBold' | 'toggleItalic' | 'toggleUnderline' | 'toggleBlockquote' | 'toggleStrike' | 'toggleBulletList' | 'toggleOrderedList' | 'setHorizontalRule') => {
  props.editor?.chain().focus()[command]().run();
};

const onFontSizeChange = (value: string) => {
  if (!props.editor) return;
  if (value === 'paragraph') {
    props.editor.chain().focus().setParagraph().run();
  } else if (value === 'h1') {
    props.editor.chain().focus().setHeading({ level: 1 }).run();
  } else if (value === 'h2') {
    props.editor.chain().focus().setHeading({ level: 2 }).run();
  } else if (value === 'h3') {
    props.editor.chain().focus().setHeading({ level: 3 }).run();
  }
};

const setFontColor = (color: string) => {
  props.editor?.chain().focus().setColor(color).run();
};

const setHighlightColor = (color: string) => {
  props.editor?.chain().focus().setHighlight({ color }).run();
};

const setAlign = (align: RteAlign) => {
  props.editor?.chain().focus().setTextAlign(align).run();
};

const undo = () => {
  props.editor?.chain().focus().undo().run();
};

const redo = () => {
  props.editor?.chain().focus().redo().run();
};

const toggleLink = () => {
  const previousUrl = props.editor?.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);

  if (url === null) return;

  if (url === '') {
    props.editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  props.editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

const clearFormatting = () => {
  props.editor?.chain().focus().clearNodes().unsetAllMarks().run();
};

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      emit('close');
    }
  };
  document.addEventListener('keydown', handleEscape);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
  });
});
</script>