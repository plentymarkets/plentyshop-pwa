<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="robots" type="text" data-testid="seo-robots-stop-indexing" />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfTooltip, SfIconInfo } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('seoCategoryRobotsNoIndex');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "After which page should robots stop indexing your category pages? Default = 0",
    "tooltip": "Defines the number of paginated pages that search engines should index. A value of 0 means only the first page is indexed, while subsequent pages are not. Increase this number only if you want additional paginated pages to appear in search results, but be aware this may create duplicate content."
  },
  "de": {
    "label": "After which page should robots stop indexing your category pages? Default = 0",
    "tooltip": "Defines the number of paginated pages that search engines should index. A value of 0 means only the first page is indexed, while subsequent pages are not. Increase this number only if you want additional paginated pages to appear in search results, but be aware this may create duplicate content."
  }
}
</i18n>
