<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description1') }}</p>
    <p class="mb-4">{{ getEditorTranslation('description2') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="googleAnalyticsCookieGroup"
        :options="options"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        label="label"
        track-by="value"
        select-label=""
        deselect-label=""
        data-testid="google-analytics-cookie-group"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import type { SettingOption } from '~/utils/editorSettings';
import { getCookieGroupOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('googleAnalyticsCookieGroup');

const options = computed(() => getCookieGroupOptions());

const googleAnalyticsCookieGroup = computed({
  get: () => {
    return options.value.find((o: SettingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Cookie Group",
    "description1": "⚠️ This group of settings will require a shop redeploy to take effect.",
    "description2": "Control if and how you want to use Google Analytics. \n When using Google Analytics, you are obliged to inform visitors about the type of use of the data. We would like to point out that when using services that transfer personal data to a third country (e.g. USA), the conditions for permissible data transfer according to Art. 44 ff GDPR must be met. This is the case, for example, when Google Analytics is used.",
    "placeholder": "Select Cookie Group"
  },
  "de": {
    "label": "Cookie Group",
    "description1": "⚠️ This group of settings will require a shop redeploy to take effect.",
    "description2": "Control if and how you want to use Google Analytics. \n When using Google Analytics, you are obliged to inform visitors about the type of use of the data. We would like to point out that when using services that transfer personal data to a third country (e.g. USA), the conditions for permissible data transfer according to Art. 44 ff GDPR must be met. This is the case, for example, when Google Analytics is used.",
    "placeholder": "Select Cookie Group"
  }
}
</i18n>
