<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="availability"
        :options="availabilityOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-availability-1"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('seoAvailability7');

const availability = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const availabilityOptions = ['In stock', 'Out of stock', 'Pre-order', 'Discontinued', 'In store only', 'Limited availability', 'Online only', 'Pre-sale', 'Sold-out', 'Back-order']
</script>

<i18n lang="json">
{
  "en": {
    "label": "Availability 2",
    "description": "",
    "placeholder": ""
  },
  "de": {
    "label": "Availability 2",
    "description": "",
    "placeholder": ""
  }
}
</i18n>
