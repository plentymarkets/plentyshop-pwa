<template>
  <div v-if="block" class="p-4">
    <h2 class="font-bold mb-4 text-lg">Home Intro</h2>

    <div class="flex flex-col gap-4">
      <div>
        <UiFormLabel>Title (H1)</UiFormLabel>
        <SfInput v-model="block.content.title" type="text" />
      </div>

      <div>
        <UiFormLabel>Subtitle (H2)</UiFormLabel>
        <SfInput v-model="block.content.subtitle" type="text" />
      </div>

      <div>
        <UiFormLabel>Lead paragraph</UiFormLabel>
        <SfTextarea v-model="block.content.lead" class="w-full min-h-[120px]" />
      </div>

      <hr class="my-2 border-gray-200" />

      <div>
        <UiFormLabel>About heading (H2)</UiFormLabel>
        <SfInput v-model="block.content.aboutHeading" type="text" />
      </div>

      <div>
        <UiFormLabel>About paragraph</UiFormLabel>
        <SfTextarea v-model="block.content.about" class="w-full min-h-[160px]" />
      </div>
    </div>
  </div>

  <div v-else class="p-4 text-red-600 bg-red-50">
    <p class="font-bold">Error: Loading block...</p>
    <p class="text-xs">If this persists, delete the block and add it again.</p>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import type { HomeIntroContent } from './types';
import { getDefaultHomeIntroContent } from './defaults';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const ensureContent = (content: HomeIntroContent) => {
  const defaults = getDefaultHomeIntroContent();
  if (!content.title) content.title = defaults.title;
  if (!content.subtitle) content.subtitle = defaults.subtitle;
  if (!content.lead) content.lead = defaults.lead;
  if (!content.aboutHeading) content.aboutHeading = defaults.aboutHeading;
  if (!content.about) content.about = defaults.about;
};

const block = computed(() => {
  if (!data.value || !blockUuid.value) return null;

  const found = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  if (!found) return null;

  const b = found as { content?: HomeIntroContent };
  if (!b.content) b.content = getDefaultHomeIntroContent();
  ensureContent(b.content);

  return b;
});
</script>

