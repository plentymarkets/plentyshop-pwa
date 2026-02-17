<template>
  Test
</template>

<!-- <template>
  <UiAccordionItem
    data-testid="announcement-bar-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('text-group-label') }}</h2>
    </template>

    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('html-description-label') }}</UiFormLabel>
      <SfTextarea
        v-model="announcementBarBlock.text.htmlDescription"
        class="min-h-[100px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
      />
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfTextarea } from '@storefront-ui/vue';
import type { AnnouncementBarFormProps, AnnouncementBarContent } from './types';

const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<AnnouncementBarFormProps>();

const announcementBarBlock = computed<AnnouncementBarContent>(() => {
  const uuid = props.uuid || blockUuid.value;
  const foundBlock = findOrDeleteBlockByUuid(data.value, uuid);

  const rawContent = foundBlock?.content ?? {};
  const content = rawContent as Partial<AnnouncementBarContent>;

  if (!content.text) {
    content.text = {};
  }
  content.text.htmlDescription = content.text.htmlDescription ?? '';

  return content as AnnouncementBarContent;
});
</script>

<i18n lang="json">
{
  "en": {
    "text-group-label": "Announcement Bar",
    "html-description-label": "Announcement Text"
  },
  "de": {
    "text-group-label": "Ankündigungsleiste",
    "html-description-label": "Ankündigungstext"
  }
}
</i18n> -->