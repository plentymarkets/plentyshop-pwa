<template>
  <UiAccordionItem
    :model-value="true"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('text-label') }}</h2>
    </template>
    {{ runtimeConfig.enableRichTextEditorV2 }}
    <div v-if="runtimeConfig.enableRichTextEditorV2" data-testid="text-card-form-v2">
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
          v-model="editingText"
          v-model:expanded="expandedToolbars.content"
          :min-height="232"
          :expandable="true"
          :text-align="'center'"
          data-testid="rte-content"
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
    <div v-else data-testid="text-card-form">
      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('html-description-label') }}</UiFormLabel>
        <SfTextarea
          id="text-html-description"
          v-model="editingText"
          data-testid="textarea-description"
          name="text-html-description"
          rows="3"
          class="min-h-[232px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="expandedSettings"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('layout-label') }}</h2>
    </template>
    <div class="py-2 px-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
      <EditorColorPicker v-model="editingBackgroundColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <SfInput v-model="editingBackgroundColor" type="text">
            <template #suffix>
              <button
                type="button"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                :style="{ backgroundColor: color }"
                @mousedown.stop
                @click.stop="toggle"
              />
            </template>
          </SfInput>
        </template>
      </EditorColorPicker>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import type { AnnouncementBarProps, AnnouncementBarFormProps } from './types';
import { SfInput, SfTextarea } from '@storefront-ui/vue';

const props = defineProps<AnnouncementBarFormProps>();

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const runtimeConfig = useRuntimeConfig().public;
const modalOpen = ref(false);
const { findOrDeleteBlockByUuid } = useBlockManager();
const expandedToolbar = ref(true);
const expandedSettings = ref(true);

const contentRichTextEditor = ref<{
  openModal: () => void;
} | null>(null);

const toggleModal = () => {
  modalOpen.value = !modalOpen.value;
};

const expandedToolbars = ref({
  content: true,
});

const block = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as AnnouncementBarProps,
);

const editingText = computed({
  get: () => block.value.content.text ?? '',
  set: (val) => {
    block.value.content.text = val;
  },
});

const editingBackgroundColor = computed({
  get: () => block.value.content.backgroundColor,
  set: (val) => {
    block.value.content.backgroundColor = val;
  },
});

const handleSwitchToWysiwygFromModal = async () => {
  if (modalOpen.value) toggleModal();
  switchToWysiwygMode();
  await nextTick();
  contentRichTextEditor.value?.openModal();
};

const handleRequestHtmlModal = () => {
  switchToHtmlMode();
  if (!modalOpen.value) toggleModal();
};

const contentModel = computed<string>({
  get: () => decodeHtmlEntities(block.value.content.text ?? ''),
  set: (val: string) => {
    block.value.content.text = val ?? '';
  },
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
</script>

<i18n lang="json">
{
  "en": {
    "text-label": "Text",
    "layout-label": "Layout settings",
    "background-color-label": "Background color"
  },
  "de": {
    "text-label": "Text",
    "layout-label": "Layout-Einstellungen",
    "background-color-label": "Hintergrundfarbe"
  }
}
</i18n>
