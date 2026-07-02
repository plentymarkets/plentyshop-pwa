<template>
  <div v-if="!modalOpen">
    <EditorAiPromptBar
      :review-target="editorWrapperRef"
      :get-current-content="() => editor?.getHTML() ?? ''"
      @apply="applyAiContent"
    />

    <div class="flex items-stretch gap-1.5 p-2 bg-gray-50 border-b border-gray-200 relative" data-testid="rte-toolbar">
      <div class="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
        <EditorRichTextEditorBasicButtons
          :cmd="cmd"
          :current-block-type="currentBlockType"
          :current-font-size="currentFontSize"
          :insert-emoji="insertEmoji"
          :insert-icon="insertIcon"
          :is-active="isActive"
          :on-font-size-change="onFontSizeChange"
          :on-open-properties-modal="openPropertiesModal"
          :on-text-size-change="setFontSize"
          :set-font-color="setFontColor"
          :show-properties-button="isProductPage"
          :text-color="textColor"
          :toggle-link="toggleLink"
        />
      </div>

      <div class="flex items-center gap-1.5 flex-shrink-0">
        <span class="w-px self-stretch bg-gray-300" />

        <UiButton
          v-if="expandable"
          :aria-expanded="expandedLocal"
          class="w-8 h-8 rounded border border-transparent bg-transparent inline-flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100"
          data-testid="rte-expand"
          type="button"
          variant="tertiary"
          @click="expandedLocal = !expandedLocal"
          @mousedown.prevent
        >
          <span :class="{ 'rotate-180': expandedLocal }" class="inline-block transition-transform duration-150">
            <svg fill="#062633" height="24px" viewBox="0 -960 960 960" width="24px" xmlns="http://www.w3.org/2000/svg">
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
        :can-redo="canRedo"
        :can-undo="canUndo"
        :clear-formatting="clearFormatting"
        :cmd="cmd"
        :highlight-color="highlightColor"
        :is-active="isActive"
        :is-active-align="isActiveAlign"
        :redo="redo"
        :set-align="setAlign"
        :set-highlight-color="setHighlightColor"
        :undo="undo"
      />
      <EditorRichTextEditorMenuButton icon-name="fullscreen" @click="openModal" />
    </div>

    <div
      ref="editorWrapperRef"
      class="p-2.5 editor-parent border border-gray-300 rounded-b-md bg-white relative"
      data-testid="rte-editor"
      @mousedown="editor?.chain().focus().run()"
    >
      <EditorContent :editor="editor" :style="editorStyle" class="rte__content rte-prose" />
    </div>
  </div>

  <EditorRichTextEditorRichtextEditorModal
    v-if="modalOpen"
    :can-redo="canRedo"
    :can-undo="canUndo"
    :clear-formatting="clearFormatting"
    :cmd="cmd"
    :current-block-type="currentBlockType"
    :current-font-size="currentFontSize"
    :editor="editor"
    :editor-style="editorStyle"
    :highlight-color="highlightColor"
    :insert-emoji="insertEmoji"
    :insert-icon="insertIcon"
    :is-active="isActive"
    :is-active-align="isActiveAlign"
    :on-font-size-change="onFontSizeChange"
    :redo="redo"
    :set-align="setAlign"
    :set-font-color="setFontColor"
    :set-font-size="setFontSize"
    :set-highlight-color="setHighlightColor"
    :text-color="textColor"
    :toggle-link="toggleLink"
    :undo="undo"
    @close="closeModal"
    @switch-to-html="handleSwitchToHtml"
  />

  <EditorRichTextEditorLinkModal v-if="linkModalOpen" :close="closeLinkModal" :editor="editor" />
  <ItemPropertiesSelectModal
    v-if="propertiesModalOpen"
    @close="closePropertiesModal"
    @insert="handlePropertyInsertion"
  />
</template>

<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3';
import ItemPropertiesSelectModal from '~/components/blocks/PriceCard/ItemPropertiesSelectModal.vue';

const modalOpen = ref(false);
const linkModalOpen = ref(false);
const editorWrapperRef = ref<HTMLElement | null>(null);

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    minHeight?: number;
    expandable?: boolean;
    expanded?: boolean;
    textAlign?: RteAlign;
    placeholder?: string;
  }>(),
  {
    modelValue: '',
    minHeight: 120,
    expandable: true,
    expanded: false,
    textAlign: 'left',
    placeholder: 'Enter text here...',
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
  currentFontSize,
  setFontSize,
  insertIcon,
  insertEmoji,
  insertPropertyPlaceholders,
} = useRichTextEditor({
  modelValue: toRef(props, 'modelValue'),
  onUpdateModelValue: (v) => emit('update:modelValue', v),
  expanded: toRef(props, 'expanded'),
  onUpdateExpanded: (v) => emit('update:expanded', v),
  textAlign: toRef(props, 'textAlign'),
  placeholder: toRef(props, 'placeholder'),
  onOpenLinkModal: () => {
    linkModalOpen.value = true;
  },
});
const propertiesModalOpen = ref(false);
const { blocksListContext } = useBlocksList();
const isProductPage = computed(() => blocksListContext.value === 'product');

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

const closeLinkModal = () => {
  linkModalOpen.value = false;
};

const handleSwitchToHtml = () => {
  closeModal();
  emit('requestHtmlModal');
};

const openPropertiesModal = () => {
  propertiesModalOpen.value = true;
};

const closePropertiesModal = () => {
  propertiesModalOpen.value = false;
};

const handlePropertyInsertion = (tokens: PropertyPlaceholderToken[]) => {
  insertPropertyPlaceholders(tokens);
  propertiesModalOpen.value = false;
};

const applyAiContent = (content: string) => {
  editor.value?.commands.setContent(content);
};

defineExpose({ editor, focus, clearFormatting, undo, redo, openModal });
</script>
