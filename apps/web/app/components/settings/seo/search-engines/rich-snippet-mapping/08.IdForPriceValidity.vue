<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-dropdown">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <SfInput
      v-model="seoRichSnippetIdForPriceValidity"
      :placeholder="getEditorTranslation('placeholder')"
      type="text"
      data-testid="seo-id-for-price-validity"
    />
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetIdForPriceValidity');

const seoRichSnippetIdForPriceValidity = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Price Validity ID",
    "tooltip": "Select source for price validity in Rich Snippets of the item page. The price validity has to be created as a variation property of the type text or date.",
    "placeholder": "Enter Price Validity ID"
  },
  "de": {
    "label": "Price Validity ID",
    "tooltip": "Select source for price validity in Rich Snippets of the item page. The price validity has to be created as a variation property of the type text or date.",
    "placeholder": "Enter Price Validity ID"
  }
}
</i18n>
