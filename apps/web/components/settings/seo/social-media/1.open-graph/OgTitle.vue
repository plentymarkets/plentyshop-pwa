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
        v-model="ogTitle"
        type="text"
        :placeholder="getEditorTranslation('placeholder')"
        data-testid="og-field"
      />
      <span class="typography-text-xs text-neutral-700">
        {{ getEditorTranslation('hint') }}
      </span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('ogTitle');

const ogTitle = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Title for OpenGraph",
    "tooltip": "The Open Graph title appears as the headline when your shop is shared on social media.",
    "placeholder": "Enter title",
    "hint": "Optimal length: 40–60 characters (max. ~80) to ensure full visibility in previews."
  },
  "de": {
    "label": "Title for OpenGraph",
    "tooltip": "The Open Graph title appears as the headline when your shop is shared on social media.",
    "placeholder": "Enter title",
    "hint": "Optimal length: 40–60 characters (max. ~80) to ensure full visibility in previews."
  }
}
</i18n>
