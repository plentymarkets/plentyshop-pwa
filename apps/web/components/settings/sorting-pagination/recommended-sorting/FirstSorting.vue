<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>First sorting option</UiFormLabel>
<!--      TODO translate here-->
      <SfTooltip
          label="First sorting option"
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
        v-model="recommendedFirstSortingOption"
        data-testid="available-sorting-options"
        :options="sortingOptions"
        placeholder="Select default option"
        label="label"
        track-by="value"
        class="cursor-pointer"
        select-label=""
        deselect-label="Selected"
        :allow-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { SortingOption } from '~/components/settings/sorting-pagination/category-sorting/types';
import {getOptionTranslation} from "../../../../utils/sortingOptionsHelper";

const { updateSetting, getSetting } = useSiteSettings('recommendedFirstSortingOption');
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { updateSorting } = useCategoryFilter();

const sortingOptions = computed(() => {
  return [
      {label: getOptionTranslation("sortingPriorityCategoryItemIdAsc", "en"), value: "item.id_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryItemIdDesc", "en"), value: "item.id_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryNameAsc", "en"), value: "texts.name_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryNameDesc", "en"), value: "texts.name_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryPriceAsc", "en"), value: "sorting.price.avg_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryPriceDesc", "en"), value: "sorting.price.avg_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationCreatedAtDesc", "en"), value: "variation.createdAt_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationCreatedAtAsc", "en"), value: "variation.createdAt_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationIdAsc", "en"), value: "variation.id_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationIdDesc", "en"), value: "variation.id_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationNumberAsc", "en"), value: "variation.number_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationNumberDesc", "en"), value: "variation.number_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryAvailabilityAsc", "en"), value: "variation.availability.averageDays_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryAvailabilityDesc", "en"), value: "variation.availability.averageDays_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationUpdatedAtAsc", "en"), value: "variation.updatedAt_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationUpdatedAtDesc", "en"), value: "variation.updatedAt_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationPositionAsc", "en"), value: "variation.position_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryVariationPositionDesc", "en"), value: "variation.position_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryManufacturerAsc", "en"), value: "item.manufacturer.externalName_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryManufacturerDesc", "en"), value: "item.manufacturer.externalName_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryManufacturerPositionAsc", "en"), value: "item.manufacturer.position_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryManufacturerPositionDesc", "en"), value: "item.manufacturer.position_desc"},
      {label: getOptionTranslation("sortingPriorityCategoryStockAsc", "en"), value: "stock.net_asc"},
      {label: getOptionTranslation("sortingPriorityCategoryStockDesc", "en"), value: "stock.net_desc"},
      {label: getOptionTranslation("sortDataRandom", "en"), value: "item.random"},
      // {label: getOptionTranslation("sortingPriorityCategoryNotSelected", "en"), value: "notSelected"},
  ];
});
//
const recommendedFirstSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
    // updateSorting(option?.value ?? '');
  },
});
</script>
