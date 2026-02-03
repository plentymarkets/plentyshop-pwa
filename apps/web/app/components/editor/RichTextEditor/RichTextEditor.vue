<template>
  <EditorRichTextEditorToolbar
    v-model:expanded-local="expandedLocal"
    :expandable="expandable"
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
    @open-modal="toggleModal"
  />
  <div class="p-2.5" @mousedown="editor?.chain().focus().run()">
    <EditorContent :editor="editor" class="rte__content rte-prose" :style="editorStyle" />
  </div>

  <EditorRichTextEditorModal v-if="modalOpen" :editor="editor" @close="toggleModal" />
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

const toggleModal = () => {
  modalOpen.value = !modalOpen.value;
};
</script>