<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip
        :label="getEditorTranslation('tooltip')"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="ogImg" type="text" :placeholder="getEditorTranslation('placeholder')" data-testid="og-image-field" />
      <span class="typography-text-xs text-neutral-700">
        {{ getEditorTranslation('hint') }}
      </span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('ogImg');

const ogImg = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Image for OpenGraph",
    "tooltip": "The Open Graph image is the preview thumbnail shown when your page is shared on social media.",
    "placeholder": "Enter URL of the image",
    "hint": "Optimal image dimensions: 1200 × 630 px (min. 600 × 315 px) for best display on social media."
  },
  "de": {
    "label": "Image for OpenGraph",
    "tooltip": "The Open Graph image is the preview thumbnail shown when your page is shared on social media.",
    "placeholder": "Enter URL of the image",
    "hint": "Optimal image dimensions: 1200 × 630 px (min. 600 × 315 px) for best display on social media."
  }
}
</i18n>
