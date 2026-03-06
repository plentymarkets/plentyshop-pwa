<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <EditorColorPicker v-model="secondaryColor" class="w-full" :show-shop-colors="false">
      <template #trigger="{ color, toggle }">
        <label>
          <SfInput v-model="secondaryColor" type="text" data-testid="secondary-color-select">
            <template #suffix>
              <button
                type="button"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                :style="{ backgroundColor: color }"
                @mousedown.stop
                @click.stop="toggle"
              />
            </template>
          </SfInput>
        </label>
      </template>
    </EditorColorPicker>
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
    "label": "Secondary colour",
    "tooltip": "Choose a secondary colour to complement your main one. A palette of 10 shades will be generated and used for highlights and accent elements throughout the shop.",
    "hint": "Choose secondary color"
  },
  "de": {
    "label": "Secondary colour",
    "tooltip": "Choose a secondary colour to complement your main one. A palette of 10 shades will be generated and used for highlights and accent elements throughout the shop.",
    "hint": "Choose secondary color"
  }
}
</i18n>
