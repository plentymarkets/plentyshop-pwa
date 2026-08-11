<template>
  <div v-if="showSetting" class="flex justify-between items-center mb-2">
    <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    <SfSwitch
      v-model="showGuaranteeNotice"
      class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
    />
  </div>
</template>
<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getBooleanSetting } = useSiteSettings('showGuaranteeNotice');
const showSetting = useFeatureFlag('shopPwaEnableEu2025-1960', false);

const showGuaranteeNotice = computed({
  get: () => getBooleanSetting(true),
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Show guarantee notice on the checkout page"
  },
  "de": {
    "label": "Show guarantee notice on the checkout page"
  }
}
</i18n>
