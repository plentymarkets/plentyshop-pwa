<template>
  <div v-if="content" class="p-4">
    <h2 class="font-bold mb-4 text-lg">Home Intro</h2>

    <div class="flex flex-col gap-4">
      <div>
        <UiFormLabel>Title (H1)</UiFormLabel>
        <SfInput v-model="content.title" type="text" />
      </div>

      <div>
        <UiFormLabel>Subtitle (H2)</UiFormLabel>
        <SfInput v-model="content.subtitle" type="text" />
      </div>

      <div>
        <UiFormLabel>Lead paragraph</UiFormLabel>
        <SfTextarea v-model="content.lead" class="w-full min-h-[120px]" />
      </div>

      <hr class="my-2 border-gray-200" />

      <div>
        <UiFormLabel>About heading (H2)</UiFormLabel>
        <SfInput v-model="content.aboutHeading" type="text" />
      </div>

      <div>
        <UiFormLabel>About paragraph</UiFormLabel>
        <SfTextarea v-model="content.about" class="w-full min-h-[160px]" />
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

const ensureContent = (raw: HomeIntroContent): HomeIntroContent => {
  const defaults = getDefaultHomeIntroContent();
  return {
    title: raw.title || defaults.title,
    subtitle: raw.subtitle || defaults.subtitle,
    lead: raw.lead || defaults.lead,
    aboutHeading: raw.aboutHeading || defaults.aboutHeading,
    about: raw.about || defaults.about,
  };
};

const content = computed<HomeIntroContent | null>(() => {
  if (!data.value || !blockUuid.value) return null;

  const found = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  if (!found) return null;

  const block = found as { content?: HomeIntroContent };
  const next = ensureContent(block.content ?? {});
  block.content = next;

  return next;
});
</script>
