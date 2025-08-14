<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="primaryColor" type="text" data-testid="primary-color-select">
        <template #suffix>
          <label
            for="primary-color"
            :style="{ backgroundColor: primaryColor }"
            class="border border-[#a0a0a0] rounded-lg cursor-pointer"
          >
            <input id="primary-color" v-model="primaryColor" type="color" class="invisible w-8" />
          </label>
        </template>
      </SfInput>
      <span class="typography-text-xs text-neutral-700">{{ getEditorTranslation('hint') }}</span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import { getPaletteFromColor, setColorProperties } from '~/utils/tailwindHelper';

const { updateSetting, getSetting } = useSiteSettings('primaryColor');

const updatePrimaryColor = (hexColor: string) => {
  const tailwindColors = getPaletteFromColor('primary', hexColor).map((color) => ({
    ...color,
  }));

  setColorProperties('primary', tailwindColors);
};

const primaryColor = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);
    updatePrimaryColor(value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Primary color",
    "tooltip": "The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process.",
    "hint": "Choose primary color"
  },
  "de": {
    "label": "Primary color",
    "tooltip": "The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process.",
    "hint": "Choose primary color"
  }
}
</i18n>
