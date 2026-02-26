@ -1,312 +0,0 @@
<template>
  <div class="sticky top-[52px] h-[80vh] overflow-y-auto">
    <UiAccordionItem
        :model-value="true"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>{{ getEditorTranslation('text-label') }}</h2>
        </template>
        <div class="py-2 px-2">
          <EditorRichTextEditor
            v-model="editingText"
            v-model:expanded="expandedToolbar"
            :min-height="100"
            :expandable="true"
          />
        </div>
      </UiAccordionItem>

      <!-- TODO: add padding toggles and background color settings here -->
  </div>
</template>

<script setup lang="ts">
import type { AnnouncementBarProps, AnnouncementBarFormProps } from './types';

const props = defineProps<AnnouncementBarFormProps>();

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();
const expandedToolbar = ref(true);

const block = computed({
  get: () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as AnnouncementBarProps,
  set: (val) => {
    const found = findOrDeleteBlockByUuid(data.value, blockUuid.value);
    if (found) Object.assign(found, val);
  },
});

const editingText = computed({
  get: () => (block.value.content.text ?? ''),
  set: (val) => { block.value.content.text = val;
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "elements-label": "Elements",
    "text-label": "Text",
    "layout-label": "Layout settings",
    "controls-label": "Controls",
    "add-label": "Add element",
    "empty-label": "(empty)",
    "background-color-label": "Background color",
    "controls-color-label": "Controls color",
    "padding-label": "Padding (px)",
    "visibility-label": "Visibility",
    "delete-label": "Delete"
  },
  "de": {
    "elements-label": "Elemente",
    "text-label": "Text",
    "layout-label": "Layout-Einstellungen",
    "controls-label": "Steuerelemente",
    "add-label": "Element hinzufügen",
    "empty-label": "(leer)",
    "background-color-label": "Hintergrundfarbe",
    "controls-color-label": "Steuerelementfarbe",
    "padding-label": "Innenabstand (px)",
    "visibility-label": "Sichtbarkeit",
    "delete-label": "Löschen"
  }
}
</i18n>