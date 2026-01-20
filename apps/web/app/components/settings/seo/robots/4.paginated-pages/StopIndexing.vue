<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput
        v-model="robots"
        type="text"
        data-testid="seo-robots-stop-indexing"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('seoCategoryRobotsNoIndex');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "After which page should robots stop indexing your category pages? Default = 0"
  },
  "de": {
    "label": "After which page should robots stop indexing your category pages? Default = 0"
  }
}
</i18n>
