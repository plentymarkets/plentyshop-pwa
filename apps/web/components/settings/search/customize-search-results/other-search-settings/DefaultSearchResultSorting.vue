<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="defaultSortingSearch"
      data-testid="search-result-sorting"
      :options="sortingOptions"
      :placeholder="getEditorTranslation('placeholder')"
      label="label"
      track-by="value"
      :allow-empty="false"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
    />
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { getMappedOptions } from '~/utils/sortingOptionsHelper';
import type { SortingOption } from '~/components/settings/category/sorting/category-sorting/types';
import { isPageOfType } from '~/utils/pathHelper';

const { updateSetting, getSetting } = useSiteSettings('defaultSortingSearch');
const { updateSorting } = useCategoryFilter();

const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');

const sortingOptions = computed(() => getMappedOptions(availableSortingOptions()));

const defaultSortingSearch = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
    if (isPageOfType('search')) {
      updateSorting(option?.value ?? '');
    }
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Default sorting for search results.",
    "tooltip": "Select the sorting option by which search results are sorted by initially. Customers can change the sorting. The available options are defined via Category > Sorting > Category Sorting > Enable item sorting by.",
    "placeholder": "Select a sorting option",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Default sorting for search results.",
    "tooltip": "Select the sorting option by which search results are sorted by initially. Customers can change the sorting. The available options are defined via Category > Sorting > Category Sorting > Enable item sorting by.",
    "placeholder": "Select a sorting option",
    "deselect-label": "Selected"
  }
}
</i18n>
