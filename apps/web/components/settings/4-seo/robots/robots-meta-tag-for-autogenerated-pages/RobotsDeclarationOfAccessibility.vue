<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="robots"
        :options="robotOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-robots-search-result"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('robotsAccessibilityDeclarationResult');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const robotOptions = ['all', 'noindex', 'nofollow', 'noindex, nofollow'];
</script>

<i18n lang="json">
{
  "en": {
    "label": "Robots for Declaration of Accessibility",
    "description": "Controls how search engines should treat Declaration of Accessibility. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots"
  },
  "de": {
    "label": "Robots for Declaration of Accessibility",
    "description": "Controls how search engines should treat Declaration of Accessibility. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots"
  }
}
</i18n>
