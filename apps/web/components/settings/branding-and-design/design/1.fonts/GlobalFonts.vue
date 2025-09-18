<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="font"
      data-testid="font-select"
      :options="fonts"
      :placeholder="getEditorTranslation('placeholder')"
      label="value"
      track-by="caption"
      :allow-empty="false"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { FontSetting } from './types';

const fonts = ref([]);

onMounted(async () => {
  const response = await fetch('/_nuxt-plenty/editor/fonts.json');
  if (response.ok) {
    fonts.value = await response.json();
  }
});

const { updateSetting, getSetting } = useSiteSettings('font');
const { loadGoogleFont } = useSiteConfiguration();

const font = computed({
  get: () => {
    return fonts.value.find((f: FontSetting) => f.value === getSetting()) ?? {};
  },
  set: (value: FontSetting) => {
    updateSetting(value.value);
    loadGoogleFont(value.value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Global fonts",
    "description": "⚠️ This setting will require a shop redeploy to take effect.",
    "tooltip": "Choose one Google Font for all texts. Fonts are served locally to ensure privacy compliance, with no live requests to Google.",
    "placeholder": "Select a font",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Global fonts",
    "description": "⚠️ This setting will require a shop redeploy to take effect.",
    "tooltip": "Choose one Google Font for all texts. Fonts are served locally to ensure privacy compliance, with no live requests to Google.",
    "placeholder": "Select a font",
    "deselect-label": "Selected"
  }
}
</i18n>
