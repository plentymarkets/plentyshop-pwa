<template>
  <div>
    <div class="py-2">
      <p class="mb-4">{{ getEditorTranslation('description') }}</p>
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      </div>
      <label>
        <SfSelect v-model="paginationSortingDynamicInherit" data-testid="editor-internal-item-sorting" class="w-full">
          <option
            v-for="sortingOption in fromItemSortingOptions"
            :key="sortingOption"
            :value="sortingOption"
            class="font-medium text-sm md:text-base"
          >
            {{ getEditorTranslation(sortingOption) }}
          </option>
        </SfSelect>
      </label>
    </div>

    <div class="py-2">
      <p class="mb-4">{{ getEditorTranslation('sortingLabel1') }}</p>
      <label>
        <SfSelect v-model="paginationSortingDynamicPrio1" data-testid="editor-internal-item-sorting" class="w-full">
          <option
            v-for="optionForSorting1 in paginationSortingDynamicInheritExtra"
            :key="optionForSorting1"
            :value="optionForSorting1"
            class="font-medium text-sm md:text-base"
          >
            {{ getEditorTranslation(optionForSorting1) }}
          </option>
        </SfSelect>
      </label>
    </div>

    <div class="py-2">
      <p class="mb-4">{{ getEditorTranslation('sortingLabel2') }}</p>
      <label>
        <SfSelect v-model="paginationSortingDynamicPrio2" data-testid="editor-internal-item-sorting" class="w-full">
          <option
            v-for="optionForSorting2 in paginationSortingDynamicInheritExtra"
            :key="optionForSorting2"
            :value="optionForSorting2"
            class="font-medium text-sm md:text-base"
          >
            {{ getEditorTranslation(optionForSorting2) }}
          </option>
        </SfSelect>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('paginationSortingDynamicInherit');
const { updateSetting: updateSettingProp1, getSetting: getSettingProp1 } = useSiteSettings(
  'paginationSortingDynamicPrio1',
);
const { updateSetting: updateSettingProp2, getSetting: getSettingProp2 } = useSiteSettings(
  'paginationSortingDynamicPrio2',
);

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
const paginationSortingDynamicPrio1 = computed({
  get: () => getSettingProp1(),
  set: (value) => updateSettingProp1(value),
});

const paginationSortingDynamicInheritExtra = computed({
  get: () => ['filter.isMain_desc', ...fromItemSortingOptions.value, 'variationId_asc', 'variationId_desc'],
  set: () => {},
});
const paginationSortingDynamicPrio2 = computed({
  get: () => getSettingProp2(),
  set: (value) => updateSettingProp2(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Internal Item Sorting",
    "sortingLabel1": "Sorting option 1",
    "sortingLabel2": "Sorting option 2",
    "description": "Use the following sorting options to determine which variation is shown on an item tile, for instance in the category page. Use the first selection to determine whether the item sorting option that the customer selects in the shop should also apply to the sorting of variations on the item tile. In this case, the selected sorting value serves as the first sorting value for the item tile. The first and second sorting options below only become effective if no clear order can be derived from the adopted item sorting, or if the adopted item sorting is not used. Sorting options that contradict each other (e.g. Manufacturer A-Z and Manufacturer Z-A) are neglected in the sorting.",
    "filter.prices.price_asc": "Price ⬆",
    "filter.prices.price_desc": "Price ⬇",
    "filter.position_asc": "Availability ⬆",
    "filter.position_desc": "Availability ⬇",
    "analyzed.number.sorting_asc": "Variation number ⬆",
    "analyzed.number.sorting_desc": "Variation number ⬇",
    "filter.availabilityAverageDays_asc": "Variation ID ⬆",
    "filter.availabilityAverageDays_desc": "Variation ID ⬇",
    "filter.isMain_desc": "Main Variation First",
    "variationId_asc": "Variation ID ⬆",
    "variationId_desc": "Variation ID ⬇"
  },
  "de": {
    "label": "Internal Item Sorting",
    "sortingLabel1": "Sorting option 1",
    "sortingLabel2": "Sorting option 2",
    "description": "Use the following sorting options to determine which variation is shown on an item tile, for instance in the category page. Use the first selection to determine whether the item sorting option that the customer selects in the shop should also apply to the sorting of variations on the item tile. In this case, the selected sorting value serves as the first sorting value for the item tile. The first and second sorting options below only become effective if no clear order can be derived from the adopted item sorting, or if the adopted item sorting is not used. Sorting options that contradict each other (e.g. Manufacturer A-Z and Manufacturer Z-A) are neglected in the sorting.",
    "filter.prices.price_asc": "Price ⬆",
    "filter.prices.price_desc": "Price ⬇",
    "filter.position_asc": "Availability ⬆",
    "filter.position_desc": "Availability ⬇",
    "analyzed.number.sorting_asc": "Variation number ⬆",
    "analyzed.number.sorting_desc": "Variation number ⬇",
    "filter.availabilityAverageDays_asc": "Variation ID ⬆",
    "filter.availabilityAverageDays_desc": "Variation ID ⬇",
    "filter.isMain_desc": "Main Variation First",
    "variationId_asc": "Variation ID ⬆",
    "variationId_desc": "Variation ID ⬇"
  }
}
</i18n>
