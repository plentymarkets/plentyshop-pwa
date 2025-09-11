<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput v-model="robots" :placeholder="getEditorTranslation('placeholder')" type="text" data-testid="seo-robots-stop-indexing" />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('robotsStopIndexing');
const runtimeConfig = useRuntimeConfig();

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "At which page should robots stop indexing your category pages?",
  },
  "de": {
    "label": "At which page should robots stop indexing your category pages?",
  }
}
</i18n>
