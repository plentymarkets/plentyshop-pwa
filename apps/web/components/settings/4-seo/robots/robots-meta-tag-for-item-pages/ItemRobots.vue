<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput v-model="robots" :placeholder="getEditorTranslation('placeholder')" type="text" data-testid="seo-robots-category-robots-no-index" />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('itemRobots');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const robotOptions = ['all', 'noindex', 'nofollow', 'noindex, nofollow'];
</script>

<i18n lang="json">
{
  "en": {
    "label": "Item Robots",
    "description": "Controls how search engines should treat Item Robots. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots"
  },
  "de": {
    "label": "Item Robots",
    "description": "Controls how search engines should treat Item Robots. Choose \"all\" to allow indexing and following links, or select other options to restrict them.",
    "placeholder": "Select robots"
  }
}
</i18n>
