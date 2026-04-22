<template>
  <div data-testid="text-form-v2">
    <EditorOptionsTabs
      :model-value="editorMode"
      test-id-prefix="mode"
      :legend="getEditorTranslation('content-label')"
      :options="editorModeOptions"
      @update:model-value="editorMode = $event"
    />

    <div v-if="editorMode === 'wysiwyg'" class="py-2">
      <EditorRichTextEditor
        ref="contentRichTextEditor"
        v-model:expanded="expandedToolbars"
        :model-value="modelValue"
        :min-height="232"
        :expandable="true"
        :text-align="textAlign"
        data-testid="rte-content"
        @update:model-value="$emit('update:modelValue', $event)"
        @request-html-modal="handleRequestHtmlModal"
      />
    </div>

    <div v-else class="py-2">
      <div class="flex items-center justify-between">
        <UiFormLabel for="html-editor" class="m-0">
          {{ getEditorTranslation('html-editor-label') }}
        </UiFormLabel>

        <EditorRichTextEditorMenuButton
          aria-label="Open HTML editor in fullscreen"
          icon-name="fullscreen"
          class="ml-2"
          @click="toggleModal"
        />
      </div>
      <SfTextarea
        id="html-editor"
        v-model="htmlDraft"
        data-testid="html-editor"
        rows="10"
        class="min-h-[232px] mt-1 block w-full border rounded-md shadow-sm sm:text-sm font-mono"
        :class="htmlErrors.length ? 'border-red-400' : 'border-gray-300'"
        :aria-invalid="htmlErrors.length ? 'true' : 'false'"
        :aria-describedby="ariaDescribedBy"
      />

      <div
        v-if="htmlErrors.length"
        id="html-editor-errors"
        data-testid="html-editor-errors"
        class="mt-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800"
        role="alert"
      >
        <div class="font-semibold">{{ getEditorTranslation('html-invalid-label') }}</div>
        <ul class="list-disc ml-5 mt-1">
          <li v-for="(e, idx) in htmlErrors.slice(0, 3)" :key="idx">{{ e }}</li>
        </ul>
      </div>
    </div>

    <EditorHtmlEditor
      v-if="modalOpen"
      v-model="htmlDraft"
      :aria-describedby="ariaDescribedBy"
      :html-errors="htmlErrors"
      @switch-to-wysiwyg="handleSwitchToWysiwygFromModal"
      @close="toggleModal"
    />
  </div>
</template>

<script setup lang="ts">
import { SfTextarea } from '@storefront-ui/vue';

const props = defineProps<{
  modelValue: string;
  textAlign?: 'left' | 'center' | 'right';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const modalOpen = ref(false);
const expandedToolbars = ref(true);
const contentRichTextEditor = ref<{ openModal: () => void } | null>(null);

const toggleModal = () => {
  modalOpen.value = !modalOpen.value;
};

const contentModel = computed<string>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const editorModeOptions = computed(
  (): Array<{ value: EditorMode; label: string; testId: string }> => [
    { value: 'wysiwyg', label: getEditorTranslation('wysiwyg-label'), testId: 'mode-wysiwyg' },
    { value: 'html', label: getEditorTranslation('html-label'), testId: 'mode-html' },
  ],
);

const { editorMode, htmlDraft, htmlErrors, ariaDescribedBy, switchToHtmlMode, switchToWysiwygMode } = useHtmlEditorMode(
  contentModel,
  {
    defaultMode: 'wysiwyg',
    commitOnValid: true,
    maxErrors: 5,
  },
);

const handleRequestHtmlModal = () => {
  switchToHtmlMode();
  if (!modalOpen.value) toggleModal();
};

const handleSwitchToWysiwygFromModal = async () => {
  if (modalOpen.value) toggleModal();
  switchToWysiwygMode();
  await nextTick();
  contentRichTextEditor.value?.openModal();
};
</script>

<i18n lang="json">
{
  "en": {
    "content-label": "Content",
    "wysiwyg-label": "Rich Text",
    "html-label": "HTML",
    "html-editor-label": "HTML editor",
    "html-invalid-label": "HTML syntax issues"
  },
  "de": {
    "content-label": "Content",
    "wysiwyg-label": "Rich Text",
    "html-label": "HTML",
    "html-editor-label": "HTML editor",
    "html-invalid-label": "HTML syntax issues"
  }
}
</i18n>
