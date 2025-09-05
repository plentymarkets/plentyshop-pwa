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
      data-testid="font-select"
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

const { updateSetting, getSetting } = useSiteSettings('defaultSortingSearch');
const { updateSorting } = useCategoryFilter();

const sortingOptionValues = [
  'item.score',
  'default.recommended_sorting',
  'variation.position_asc',
  'variation.position_desc',
  'texts.name1_asc',
  'texts.name1_desc',
  'sorting.price.avg_asc',
  'sorting.price.avg_desc',
  'variation.createdAt_desc',
  'variation.createdAt_asc',
  'variation.availability.averageDays_asc',
  'variation.availability.averageDays_desc',
  'variation.number_asc',
  'variation.number_desc',
  'variation.updatedAt_asc',
  'variation.updatedAt_desc',
  'item.manufacturer.externalName_asc',
  'item.manufacturer.externalName_desc',
];

const sortingOptions = computed(() => getMappedOptions(sortingOptionValues));

const defaultSortingSearch = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
    if (useNuxtApp().$router.currentRoute.value.meta.type === 'search') {
      updateSorting(option?.value ?? '');
    }
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Default sorting for search results.",
    "tooltip": "Select the sorting option by which search results are sorted by initially. Customers can change the sorting.",
    "placeholder": "Select a sorting option",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Default sorting for search results.",
    "tooltip": "Select the sorting option by which search results are sorted by initially. Customers can change the sorting.",
    "placeholder": "Select a sorting option",
    "deselect-label": "Selected"
  }
}
</i18n>
