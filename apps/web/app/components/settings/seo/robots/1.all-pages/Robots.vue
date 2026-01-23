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
        data-testid="seo-robots"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('robots');

const robots = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const robotOptions = ['all', 'noindex', 'nofollow', 'noindex, nofollow'];
</script>

<i18n lang="json">
{
  "en": {
    "label": "Robots",
    "description": "Sets the default search engine behavior for all pages on your shop. By default, all pages should be indexed (“all”) to ensure your products and content are discoverable. Changing this setting will affect all pages unless overridden individually, so only modify it if you have a clear reason to limit indexing sitewide, such as for a staging or private version of your shop.",
    "placeholder": "Select robots meta tag"
  },
  "de": {
    "label": "Robots",
    "description": "Sets the default search engine behavior for all pages on your shop. By default, all pages should be indexed (“all”) to ensure your products and content are discoverable. Changing this setting will affect all pages unless overridden individually, so only modify it if you have a clear reason to limit indexing sitewide, such as for a staging or private version of your shop.",
    "placeholder": "Select robots meta tag"
  }
}
</i18n>
