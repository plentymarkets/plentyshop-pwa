<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="condition"
        :options="conditionOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-b-stock"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('itemConditionNewWithLabel');

const condition = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const conditionOptions = ['https://schema.org/NewCondition', 'https://schema.org/UsedCondition', 'https://schema.org/DamagedCondition', 'https://schema.org/RefurbishedCondition']
</script>

<i18n lang="json">
{
  "en": {
    "label": "Item condition: B-Stock",
    "description": "",
    "placeholder": "Item condition: B-Stock"
  },
  "de": {
    "label": "Item condition: B-Stock",
    "description": "",
    "placeholder": "Item condition: B-Stock"
  }
}
</i18n>
