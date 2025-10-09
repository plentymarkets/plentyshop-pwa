<template>
  <div class="mt-4">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <p class="mb-4">{{ getEditorTranslation('note') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>

    <Multiselect
      v-model="recommendedFirstSortingOption"
      data-testid="recommended-first-sorting-select"
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
import { getEditorTranslation, sortingCategory } from '~/utils/sortingOptionsHelper';

const { updateSetting, getSetting } = useSiteSettings('recommendedFirstSortingOption');

const sortingOptions = computed(() => sortingCategory);
const { $dynamicEditorTranslation } = useNuxtApp();

const recommendedFirstSortingOption = computed({
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
    "description": "Control how the \"Recommended\" sorting option is composed. Select three sorting options. The first sorting option takes the highest priority, the second option the second highest, etc.",
    "note": "Note: These settings are only applied after saving the changes and reloading the page",
    "label": "First sorting option",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "description": "Control how the \"Recommended\" sorting option is composed. Select three sorting options. The first sorting option takes the highest priority, the second option the second highest, etc.",
    "note": "Note: These settings are only applied after saving the changes and reloading the page",
    "label": "First sorting option",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
