<template>
  <div class="mt-4">
    <div class="flex justify-between mb-4">
      <p>{{ getEditorTranslation('description') }}</p>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfSwitch
        v-model="variationPosition"
        data-testid="variation-position-toggle"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('itemSortByMonthlySales');

const variationPosition = computed({
  get: () => getSetting() === '1',
  set: (value) => updateSetting(value ? '1' : '0'),
});
</script>

<i18n lang="json">
{
  "en": {
    "description": "⚠️ Global setting",
    "tooltip": "Calculate the variation position based on monthly sales. This happens once per day.",
    "label": "Calculate the variation position based on monthly sales",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "description": "⚠️ Global setting",
    "tooltip": "Calculate the variation position based on monthly sales. This happens once per day.",
    "label": "Calculate the variation position based on monthly sales",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
