<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip
        :label="getEditorTranslation('tooltip')"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
        data-testid="default-sorting-tooltip"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="defaultSortingOption"
      data-testid="default-sorting-select"
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
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('defaultSortingOption');
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { updateSorting } = useCategoryFilter();
const { $dynamicEditorTranslation } = useNuxtApp();

const sortingOptions = computed(() => availableSortingOptions());

const defaultSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((option) => option === getSetting());
  },
  set: (option) => {
    updateSetting(option ?? '');
    if (isPageOfType('category')) {
      updateSorting(option ?? '');
    }
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Default sorting",
    "tooltip": "Which sorting option do you want to preselect by default for the category page?",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Default sorting",
    "tooltip": "Which sorting option do you want to preselect by default for the category page?",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
