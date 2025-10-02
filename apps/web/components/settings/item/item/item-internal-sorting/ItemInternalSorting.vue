<template>
  <div>
    <div class="py-2">
      <p class="mb-4">{{ getEditorTranslation('description') }}</p>
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      </div>
      <Multiselect
        v-model="sortingDynamicInherit"
        data-testid="editor-internal-item-sorting"
        :options="fromItemSortingOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :allow-empty="false"
        class="cursor-pointer"
        deselect-label="Selected"
      >
        <template #singleLabel="{ option }">
          {{ getEditorTranslation(option) }}
        </template>
        <template #option="props">
          {{ getEditorTranslation(props.option) }}
        </template>
      </Multiselect>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('sortingLabel1') }}</UiFormLabel>
      </div>
      <Multiselect
        v-model="sortingDynamicPrio1"
        data-testid="editor-internal-sortingDynamicPrio1"
        :options="sortingDynamicInheritExtra"
        :placeholder="getEditorTranslation('placeholder')"
        :allow-empty="false"
        class="cursor-pointer"
        deselect-label="Selected"
      >
        <template #singleLabel="{ option }">
          {{ getEditorTranslation(option) }}
        </template>
        <template #option="props">
          {{ getEditorTranslation(props.option) }}
        </template>
      </Multiselect>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('sortingLabel2') }}</UiFormLabel>
      </div>

      <Multiselect
        v-model="sortingDynamicPrio2"
        data-testid="editor-internal-sortingDynamicPrio2"
        :options="sortingDynamicInheritExtra"
        :placeholder="getEditorTranslation('placeholder')"
        :allow-empty="false"
        class="cursor-pointer"
        deselect-label="Selected"
      >
        <template #singleLabel="{ option }">
          {{ getEditorTranslation(option) }}
        </template>
        <template #option="props">
          {{ getEditorTranslation(props.option) }}
        </template>
      </Multiselect>
    </div>
  </div>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';
const { updateSetting, getSetting } = useSiteSettings('sortingDynamicInherit');
const { updateSetting: updateSettingProp1, getSetting: getSettingProp1 } = useSiteSettings('sortingDynamicPrio1');
const { updateSetting: updateSettingProp2, getSetting: getSettingProp2 } = useSiteSettings('sortingDynamicPrio2');

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

const sortingDynamicInherit = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
const sortingDynamicPrio1 = computed({
  get: () => getSettingProp1(),
  set: (value) => updateSettingProp1(value),
});

const sortingDynamicInheritExtra = computed({
  get: () => ['filter.isMain_desc', ...fromItemSortingOptions.value, 'variationId_asc', 'variationId_desc'],
  set: () => {},
});
const sortingDynamicPrio2 = computed({
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
