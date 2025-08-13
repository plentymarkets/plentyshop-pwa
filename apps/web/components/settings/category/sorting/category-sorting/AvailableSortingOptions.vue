<template>
  <div class="">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Available Sorting Options</UiFormLabel>
      <SfTooltip
        label="Which of the following sorting options do you want to make available to your customers in the category view?"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="availableSortingOptions"
      data-testid="available-sorting-options"
      :options="sortingOptions"
      placeholder="Mark some options as available"
      label="label"
      track-by="value"
      :allow-empty="false"
      class="cursor-pointer"
      select-label=""
      deselect-label="Selected"
      :multiple="true"
      :taggable="true"
      tag-placeholder=""
      @remove="removeOption"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { SortingOption } from '~/components/settings/category/sorting/category-sorting/types';
import { getMappedOptions } from '~/utils/sortingOptionsHelper';

const { updateSetting, getJsonSetting } = useSiteSettings('availableSortingOptions');
const { updateSetting: updateDefaultSorting, getSetting: getDefaultSortingOption } =
  useSiteSettings('defaultSortingOption');
const { updateSorting } = useCategoryFilter();

const sortingOptionValues = [
  'default.recommended_sorting',
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
  'variation.position_asc',
  'variation.position_desc',
  'item.feedbackDecimal_asc',
  'item.feedbackDecimal_desc',
];

const sortingOptions = computed(() => getMappedOptions(sortingOptionValues));

const availableSortingOptions = computed({
  get: () => {
    const values: string[] = getJsonSetting() || [];

    return sortingOptions.value.filter((sortingOption: SortingOption) => values.includes(sortingOption.value));
  },
  set: (selectedOptions: SortingOption[]) => {
    const values = selectedOptions.map((sortingOption: SortingOption) => sortingOption.value);
    updateSetting(JSON.stringify(values));
  },
});

const removeOption = (option: SortingOption) => {
  if (option.value === getDefaultSortingOption()) {
    updateSorting('');
    updateDefaultSorting('');
  }
};
</script>
