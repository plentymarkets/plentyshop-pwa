<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>

    <Multiselect
      v-model="recommendedThirdSortingOption"
      data-testid="recommended-third-sorting-select"
      :options="sortingOptions"
      :placeholder="getEditorTranslation('placeholder')"
      :custom-label="(option) => $dynamicEditorTranslation(option)"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
      :allow-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';

const { updateSetting, getSetting } = useSiteSettings('recommendedThirdSortingOption');

const sortingOptions = computed(() => sortingCategory);
const { $dynamicEditorTranslation } = useNuxtApp();

const recommendedThirdSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((option) => option === getSetting());
  },
  set: (option) => {
    updateSetting(option ?? '');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Third sorting option",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Third sorting option",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
