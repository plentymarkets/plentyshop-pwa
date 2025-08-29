<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="googleAnalyticsCookieGroup"
        :options="googleAnalyticsCookieGroupOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="google-analytics-cookiegroup"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('googleAnalyticsCookieGroup');

const googleAnalyticsCookieGroup = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const googleAnalyticsCookieGroupOptions = ['Necessary', 'External media', 'Functional', 'Marketing (recommened)']
</script>

<i18n lang="json">
{
  "en": {
    "label": "Cookie Group",
    "description": "",
    "placeholder": ""
  },
  "de": {
    "label": "Cookie Group",
    "description": "",
    "placeholder": ""
  }
}
</i18n>
