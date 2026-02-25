<template>
  <div v-if="!modalOpen">
    <div class="flex items-stretch gap-1.5 p-2 bg-gray-50 border-b border-gray-200 relative" data-testid="rte-toolbar">
      <div class="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
        <EditorRichTextEditorBasicButtons
          :cmd="cmd"
          :is-active="isActive"
          :current-block-type="currentBlockType"
          :on-font-size-change="onFontSizeChange"
          :text-color="textColor"
          :set-font-color="setFontColor"
          :toggle-link="toggleLink"
        />
      </div>

      <div class="flex items-center gap-1.5 flex-shrink-0">
        <span class="w-px self-stretch bg-gray-300" />

        <UiButton
          v-if="expandable"
          variant="tertiary"
          type="button"
          class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
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
        </UiButton>
      </div>
    </div>

    <div
      v-if="expandable && expandedLocal"
      class="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200"
      data-testid="rte-toolbar-expanded"
    >
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
      <EditorRichTextEditorMenuButton icon-name="fullscreen" @click="openModal" />
    </div>

    <div class="p-2.5 editor-parent" data-testid="rte-editor" @mousedown="editor?.chain().focus().run()">
      <EditorContent :editor="editor" class="rte__content rte-prose" :style="editorStyle" />
    </div>
  </div>

  <EditorRichTextEditorRichtextEditorModal
    v-if="modalOpen"
    :editor="editor"
    :editor-style="editorStyle"
    :cmd="cmd"
    :is-active="isActive"
    :current-block-type="currentBlockType"
    :on-font-size-change="onFontSizeChange"
    :text-color="textColor"
    :highlight-color="highlightColor"
    :set-font-color="setFontColor"
    :set-highlight-color="setHighlightColor"
    :set-align="setAlign"
    :is-active-align="isActiveAlign"
    :can-undo="canUndo"
    :can-redo="canRedo"
    :undo="undo"
    :redo="redo"
    :toggle-link="toggleLink"
    :clear-formatting="clearFormatting"
    @switch-to-html="handleSwitchToHtml"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3';

const modalOpen = ref(false);

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
  (e: 'requestHtmlModal'): void;
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

const editorStyle = computed(() => ({
  minHeight: `${props.minHeight}px`,
  ...textAlignStyle.value,
}));

const openModal = () => {
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const handleSwitchToHtml = () => {
  closeModal();
  emit('requestHtmlModal');
};

defineExpose({ editor, focus, clearFormatting, undo, redo, openModal });
</script>
