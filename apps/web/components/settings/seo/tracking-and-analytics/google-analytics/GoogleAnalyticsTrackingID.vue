<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput
        v-model="googleAnalyticsTrakingId"
        type="text"
        data-testid="google-analytics-tracking-id"
        :placeholder="getEditorTranslation('placeholder')"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('googleAnalyticsTrakingId');
const runtimeConfig = useRuntimeConfig();

const googleAnalyticsTrakingId = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Google analytics Tracking ID",
    "placeholder": "Google analytics Tracking ID"
  },
  "de": {
    "label": "Google analytics Tracking ID",
    "placeholder": "Google analytics Tracking ID"
  }
}
</i18n>
