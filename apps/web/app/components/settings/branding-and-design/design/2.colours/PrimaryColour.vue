<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <EditorColorPicker v-model="primaryColor" class="w-full" :show-shop-colors="false">
      <template #trigger="{ color, toggle }">
        <label>
          <SfInput v-model="primaryColor" type="text" data-testid="primary-color-select">
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
    "label": "Primary colour",
    "tooltip": "Select the main colour for the shop. We’ll generate 10 matching shades and apply them to key elements to define your shop's overall look and feel.",
    "hint": "Choose primary color"
  },
  "de": {
    "label": "Primary colour",
    "tooltip": "Select the main colour for the shop. We’ll generate 10 matching shades and apply them to key elements to define your shop's overall look and feel.",
    "hint": "Choose primary color"
  }
}
</i18n>
