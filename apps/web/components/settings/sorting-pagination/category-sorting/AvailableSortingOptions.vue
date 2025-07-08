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
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { SortingOption } from '~/components/settings/sorting-pagination/category-sorting/types';

const sortingOptions = ref([
  { label: 'Recommended', value: 'default.recommended_sorting' },

  { label: 'Name A-Z', value: 'texts.name1_asc' },
  { label: 'Name Z-A', value: 'texts.name1_desc' },

  { label: 'Price ⬆', value: 'sorting.price.avg_asc' },
  { label: 'Price ⬇', value: 'sorting.price.avg_desc' },

  { label: 'Newest items', value: 'variation.createdAt_desc' },
  { label: 'Oldest items', value: 'variation.createdAt_asc' },

  { label: 'Availability ⬆', value: 'variation.availability.averageDays_asc' },
  { label: 'Availability ⬇', value: 'variation.availability.averageDays_desc' },

  { label: 'Variation number ⬆', value: 'variation.number_asc' },
  { label: 'Variation number ⬇', value: 'variation.number_desc' },

  { label: 'Last update', value: 'variation.updatedAt_asc' },
  { label: 'First update', value: 'variation.updatedAt_desc' },

  { label: 'Manufacturer A-Z', value: 'item.manufacturer.externalName_asc' },
  { label: 'Manufacturer Z-A', value: 'item.manufacturer.externalName_desc' },

  { label: 'Top seller ⬆', value: 'variation.position_asc' },
  { label: 'Top seller ⬇', value: 'variation.position_desc' },

  { label: 'Item reviews ⬆', value: 'item.feedbackDecimal_asc' },
  { label: 'Item reviews ⬇', value: 'item.feedbackDecimal_desc' },
]);

const { updateSetting, getSetting } = useSiteSettings('availableSortingOptions');

const availableSortingOptions = computed({
  get: () => {
    const values: string[] = getSetting() ? JSON.parse(getSetting()) : [];

    return sortingOptions.value.filter((sortingOption: SortingOption) => values.includes(sortingOption.value));
  },
  set: (selectedOptions: SortingOption[]) => {
    const values = selectedOptions.map((sortingOption: SortingOption) => sortingOption.value);
    updateSetting(JSON.stringify(values));
  },
});
</script>
