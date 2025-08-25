<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput
        v-model="metaTitle"
        type="text"
        data-testid="seo-title"
        :placeholder="getEditorTranslation('placeholder')"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('metaTitle');

const metaTitle = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Default title",
    "tooltip": "Title displayed in search results of search engines (format: Title \uFF5C Shop Name). The Shop Name is editable under 'Branding & design'.",
    "placeholder": "Enter title"
  },
  "de": {
    "label": "Title",
    "tooltip": "Title displayed in search results of search engines (format: Title \uFF5C Shop Name). The Shop Name is editable under 'Branding & design'.",
    "placeholder": "Enter title"
  }
}
</i18n>
