<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfTextarea
        v-model="metaDescription"
        data-testid="seo-description"
        class="w-full"
        :placeholder="getEditorTranslation('placeholder')"
        rows="3"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfTextarea, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('metaDescription');

const metaDescription = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Default meta description",
    "tooltip": "Short description of the shop shown in search results of search engines. Should be engaging and informative.",
    "placeholder": "Enter description"
  },
  "de": {
    "label": "Default meta description",
    "tooltip": "Short description of the shop shown in search results of search engines. Should be engaging and informative.",
    "placeholder": "Enter description"
  }
}
</i18n>
