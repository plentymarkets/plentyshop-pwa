<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <div v-if="runtimeConfig.enableColorPicker">
      <label>
        <SfInput v-model="iconColor" type="text" data-testid="icon-color">
          <template #suffix>
            <label
              for="icon-color"
              :style="{ backgroundColor: iconColor }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input id="icon-color" v-model="iconColor" type="color" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>
    <EditorColorPicker v-else v-model="iconColor" class="w-full">
      <template #trigger="{ color, toggle }">
        <label>
          <SfInput v-model="iconColor" type="text" data-testid="icon-color">
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
const runtimeConfig = useRuntimeConfig().public;

const { updateSetting, getSetting } = useSiteSettings('iconColor');

const iconColor = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Icon colour",
    "tooltip": "If set, this colour overrides the default white of the icons in the header, ensuring sufficient contrast with your chosen background."
  },
  "de": {
    "label": "Icon colour",
    "tooltip": "If set, this colour overrides the default white of the icons in the header, ensuring sufficient contrast with your chosen background."
  }
}
</i18n>
