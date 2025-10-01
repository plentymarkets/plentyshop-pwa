<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfSelect v-model="paginationSortingDynamicInherit" data-testid="editor-internal-item-sorting" class="w-full">
        <option v-for="sortingOption in fromItemSortingOptions" :key="sortingOption" :value="sortingOption"
          class="font-medium text-sm md:text-base">
          {{ getEditorTranslation(sortingOption) }}
        </option>
      </SfSelect>
    </label>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('paginationSortingDynamicInherit');

const fromItemSortingOptions = ref([
  'filter.prices.price_asc',
  'filter.prices.price_desc',
  'filter.position_asc',
  'filter.position_desc',
  'filter.availabilityAverageDays_asc',
  'filter.availabilityAverageDays_desc',
  'analyzed.number.sorting_asc',
  'analyzed.number.sorting_desc',
]);

const paginationSortingDynamicInherit = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">{
  "en": {
    "label": "Internal Item Sorting",
    "description": "Use the following sorting options to determine which variation is shown on an item tile, for instance in the category page. Use the first selection to determine whether the item sorting option that the customer selects in the shop should also apply to the sorting of variations on the item tile. In this case, the selected sorting value serves as the first sorting value for the item tile. The first and second sorting options below only become effective if no clear order can be derived from the adopted item sorting, or if the adopted item sorting is not used. Sorting options that contradict each other (e.g. Manufacturer A-Z and Manufacturer Z-A) are neglected in the sorting.",
    "filter.prices.price_asc": "Price ⬆",
    "filter.prices.price_desc": "Price ⬇",
    "filter.position_asc": "Availability ⬆",
    "filter.position_desc": "Availability ⬇",
    "filter.availabilityAverageDays_asc": "Variation number ⬆",
    "filter.availabilityAverageDays_desc": "Variation number ⬇",
    "analyzed.number.sorting_asc": "Variation ID ⬆",
    "analyzed.number.sorting_desc": "Variation ID ⬇"
  },
  "de": {
    "label": "Internal Item Sorting",
    "description": "Use the following sorting options to determine which variation is shown on an item tile, for instance in the category page. Use the first selection to determine whether the item sorting option that the customer selects in the shop should also apply to the sorting of variations on the item tile. In this case, the selected sorting value serves as the first sorting value for the item tile. The first and second sorting options below only become effective if no clear order can be derived from the adopted item sorting, or if the adopted item sorting is not used. Sorting options that contradict each other (e.g. Manufacturer A-Z and Manufacturer Z-A) are neglected in the sorting.",
    "filter.prices.price_asc": "Preis ⬆",
    "filter.prices.price_desc": "Price ⬇",
    "filter.position_asc": "Availability ⬆",
    "filter.position_desc": "Availability ⬇",
    "filter.availabilityAverageDays_asc": "Variation number ⬆",
    "filter.availabilityAverageDays_desc": "Variation number ⬇",
    "analyzed.number.sorting_asc": "Variation ID ⬆",
    "analyzed.number.sorting_desc": "Variation ID ⬇"
  },
}</i18n>
