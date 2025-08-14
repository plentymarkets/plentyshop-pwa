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
      <span class="typography-text-xs text-neutral-700">{{ getEditorTranslation('hint') }}</span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('iconColor');

const iconColor = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Icon color",
    "tooltip": "Use this to override the default white icon color in the header, ensuring sufficient contrast with your chosen background.",
    "hint": "Choose icon color"
  },
  "de": {
    "label": "Icon color",
    "tooltip": "Use this to override the default white icon color in the header, ensuring sufficient contrast with your chosen background.",
    "hint": "Choose icon color"
  }
}
</i18n>
