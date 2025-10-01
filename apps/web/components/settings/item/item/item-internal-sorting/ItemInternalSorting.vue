<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfSelect v-model="paginationSortingDynamicInherit" data-testid="editor-bundleSettings-select" class="w-full">
        <option v-for="bundleOption in fromItemSortingOptions" :key="bundleOption.key" :value="bundleOption.key"
          class="font-medium text-sm md:text-base">
          {{ getEditorTranslation('option-' + bundleOption.key + '-label') }}
        </option>
      </SfSelect>
    </label>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('dontSplitItemBundle');

const fromItemSortingOptions = ref([
  {
    key: 'filter.prices.price_asc',
    text: 'Price ⬆',
  },
  {
    key: 'filter.prices.price_desc',
    text: 'Price ⬇',
  },
  { key: 'filter.position_asc', text: 'Availability ⬆' },
  { key: 'filter.position_desc', text: 'Availability ⬇' },
  { key: 'filter.availabilityAverageDays_asc', text: 'Variation number ⬆' },
  { key: 'filter.availabilityAverageDays_desc', text: 'Variation number ⬇' },
  { key: 'analyzed.number.sorting_asc', text: 'Variation ID ⬆' },
  { key: 'analyzed.number.sorting_desc', text: 'Variation ID ⬆' },
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
    "option-0-label": "Only list the components of the item bundle and replace the item bundle with the basic items in the order process",
    "option-1-label": "Only show item bundle without individual components and do not split the item bundle in the order process",
    "option-2-label": "List both the item bundle and its individual components"
  },
  "de": {
    "label": "Internal Item Sorting",
    "description": "Use the following sorting options to determine which variation is shown on an item tile, for instance in the category page. Use the first selection to determine whether the item sorting option that the customer selects in the shop should also apply to the sorting of variations on the item tile. In this case, the selected sorting value serves as the first sorting value for the item tile. The first and second sorting options below only become effective if no clear order can be derived from the adopted item sorting, or if the adopted item sorting is not used. Sorting options that contradict each other (e.g. Manufacturer A-Z and Manufacturer Z-A) are neglected in the sorting.",
    "option-0-label": "Only list the components of the item bundle and replace the item bundle with the basic items in the order process",
    "option-1-label": "Only show item bundle without individual components and do not split the item bundle in the order process",
    "option-2-label": "List both the item bundle and its individual components"
  }
}</i18n>
