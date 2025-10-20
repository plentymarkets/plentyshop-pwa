<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
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
        data-testid="seo-robots-cancellation-form"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { robotsOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('robotsCancellationForm');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Robots for cancellation form",
    "description": "Controls how search engines should treat pages that are automatically generated. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots"
  },
  "de": {
    "label": "Robots for cancellation form",
    "description": "Controls how search engines should treat pages that are automatically generated. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots"
  }
}
</i18n>
