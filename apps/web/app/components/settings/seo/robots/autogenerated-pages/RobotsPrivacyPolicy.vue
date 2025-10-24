<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="robots"
        :options="robotsOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-robots-privacy-policy"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { robotsOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('robotsPrivacyPolicy');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Robots for privacy policy",
    "placeholder": "Select robots"
  },
  "de": {
    "label": "Robots for privacy policy",
    "placeholder": "Select robots"
  }
}
</i18n>
