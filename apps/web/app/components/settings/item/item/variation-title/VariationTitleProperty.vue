<template>
  <div class="py-2 mb-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2 items-center gap-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'left'" class="z-[9999]">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <SfInput
      v-model="variationTitlePropertyId"
      type="number"
      inputmode="numeric"
      min="1"
      :placeholder="getEditorTranslation('placeholder')"
      data-testid="variation-title-property-input"
    />
    <p class="mt-2 text-sm text-neutral-500">
      {{ getEditorTranslation('hint') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('variationTitleProperty');
const variationTitlePropertyId = computed({
  get: () => getSetting() || '',
  set: (value: string | number) => {
    const normalizedValue = String(value ?? '').trim();

    updateSetting(normalizedValue);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Variation title property ID",
    "description": "Enter the variation property ID that should be used as the storefront item title. When set, each product uses the matching property value as its title. If a product has no value entered for that property, it falls back to the default Title.",
    "tooltip": "Use the variation property ID from the backend. Leave this empty to fall back to the default Title.",
    "placeholder": "Enter variation property ID",
    "hint": "Leave the field empty to use the default Title."
  },
  "de": {
    "label": "Variation title property ID",
    "description": "Enter the variation property ID that should be used as the storefront item title. When set, each product uses the matching property value as its title. If a product has no value entered for that property, it falls back to the default Title.",
    "tooltip": "Use the variation property ID from the backend. Leave this empty to fall back to the default Title.",
    "placeholder": "Enter variation property ID",
    "hint": "Leave the field empty to use the default Title."
  }
}
</i18n>