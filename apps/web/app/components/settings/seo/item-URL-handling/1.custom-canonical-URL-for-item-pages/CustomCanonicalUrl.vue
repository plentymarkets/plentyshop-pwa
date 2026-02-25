<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <label>
      <SfInput
        v-model="itemCanonicalId"
        :placeholder="getEditorTranslation('placeholder')"
        type="text"
        data-testid="seo-custom-canonical-url-for-single-item"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('itemCanonicalId');

const itemCanonicalId = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Set up custom Canonical URL for single item views",
    "tooltip": "You can use a variation property of the type Text to define a canonical URL on the level of the variation. You need to link this property to each variation and enter the canonical URL in the variation's configuration menu. Use this to prevent duplicate content for search engines.",
    "placeholder": "ID from variation property of the type \"Text\"."
  },
  "de": {
    "label": "Select source for the brand in Rich Snippets of the item page",
    "tooltip": "You can use a variation property of the type Text to define a canonical URL on the level of the variation. You need to link this property to each variation and enter the canonical URL in the variation's configuration menu. Use this to prevent duplicate content for search engines.",
    "placeholder": "ID from variation property of the type \"Text\"."
  }
}
</i18n>
