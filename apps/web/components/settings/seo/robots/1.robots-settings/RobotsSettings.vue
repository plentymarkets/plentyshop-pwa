<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <Multiselect
        v-model="robots"
        :options="robotOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-robots"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('robots');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const robotOptions = ['all', 'noindex', 'nofollow', 'noindex, nofollow'];
</script>

<i18n lang="json">
{
  "en": {
    "label": "Robots",
    "tooltip": "Controls how search engines treat your pages. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots meta tag"
  },
  "de": {
    "label": "Robots",
    "tooltip": "Controls how search engines treat your pages. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots meta tag"
  }
}
</i18n>
