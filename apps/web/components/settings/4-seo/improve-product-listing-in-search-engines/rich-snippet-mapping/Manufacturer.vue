<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="seoRichSnippetManufacturer"
        :options="seoRichSnippetManufacturers"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-source-brand"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetManufacturer');

const seoRichSnippetManufacturer = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetManufacturers = ['Do not display', 'External name of the manufacturer', 'Name of the manufacturer'];
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for the brand in Rich Snippets of the item page",
    "description": "",
    "placeholder": ""
  },
  "de": {
    "label": "Select source for the brand in Rich Snippets of the item page",
    "description": "",
    "placeholder": ""
  }
}
</i18n>
