<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <EditorColorPicker v-model="headerBackgroundColor" class="w-full">
      <template #trigger="{ color, toggle }">
        <label>
          <SfInput v-model="headerBackgroundColor" type="text" data-testid="header-background-color-select">
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

const { updateSetting, getSetting } = useSiteSettings('headerBackgroundColor');

const updateHeaderBackgroundColor = (hexColor: string) => {
  const tailwindColors = getPaletteFromColor('header', hexColor).map((color) => ({
    ...color,
  }));

  setColorProperties('header', tailwindColors);
};

const headerBackgroundColor = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);
    updateHeaderBackgroundColor(value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Background colour",
    "tooltip": "If set, this background colour takes priority over your defined primary colour for the header."
  },
  "de": {
    "label": "Background colour",
    "tooltip": "If set, this background colour takes priority over your defined primary colour for the header."
  }
}
</i18n>
