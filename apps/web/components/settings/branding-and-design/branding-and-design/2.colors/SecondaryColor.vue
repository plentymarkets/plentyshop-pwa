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
      <SfInput v-model="secondaryColor" type="text" data-testid="secondary-color-select">
        <template #suffix>
          <label
            for="secondary-color"
            :style="{ backgroundColor: secondaryColor }"
            class="border border-[#a0a0a0] rounded-lg cursor-pointer"
          >
            <input id="secondary-color" v-model="secondaryColor" type="color" class="invisible w-8" />
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

const { updateSetting, getSetting } = useSiteSettings('secondaryColor');

const updateSecondaryColor = (hexColor: string) => {
  const tailwindColors = getPaletteFromColor('secondary', hexColor).map((color) => ({
    ...color,
  }));

  setColorProperties('secondary', tailwindColors);
};

const secondaryColor = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);
    updateSecondaryColor(value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Secondary color",
    "tooltip": "The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process.",
    "hint": "Choose secondary color"
  },
  "de": {
    "label": "Secondary color",
    "tooltip": "The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process.",
    "hint": "Choose secondary color"
  }
}
</i18n>
