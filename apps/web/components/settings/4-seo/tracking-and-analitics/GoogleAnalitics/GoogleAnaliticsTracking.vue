<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput
        v-model="googleAnalyticsTrakingId"
        type="text"
        data-testid="seo-keywords"
        :placeholder="getEditorTranslation('placeholder')"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('googleAnalyticsTrakingId');

const googleAnalyticsTrakingId = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Google analytics Tracking ID",
    "tooltip": "",
    "placeholder": ""
  },
  "de": {
    "label": "Google analytics Tracking ID",
    "tooltip": "",
    "placeholder": ""
  }
}
</i18n>
