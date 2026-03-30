<template>
  <UiAccordionItem
    :model-value="expandedTextSettings"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('text-label') }}</h2>
    </template>

    <EditorRichTextEditorForm v-model="editingText" :text-align="'center'" />
  </UiAccordionItem>

  <UiAccordionItem
    v-model="expandedLayoutSettings"
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
import { SfInput } from '@storefront-ui/vue';

const props = defineProps<AnnouncementBarFormProps>();

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();
const expandedLayoutSettings = ref(true);
const expandedTextSettings = ref(true);

const block = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as AnnouncementBarProps,
);

const editingText = computed({
  get: () => decodeHtmlEntities(block.value.content.text ?? ''),
  set: (val: string) => {
    block.value.content.text = val ?? '';
  },
});

const editingBackgroundColor = computed({
  get: () => block.value.content.backgroundColor,
  set: (val) => {
    block.value.content.backgroundColor = val;
  },
});
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
