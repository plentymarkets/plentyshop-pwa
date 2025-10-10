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
        :placeholder="getEditorTranslation('placeholderForSortingInherit')"
        :allow-empty="false"
        :custom-label="(option) => $dynamicEditorTranslation(option)"
        class="cursor-pointer"
        deselect-label="Selected"
        :multiple="true"
      />
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('sortingLabel1') }}</UiFormLabel>
      </div>
      <Multiselect
        v-model="sortingDynamicPrio1"
        data-testid="editor-internal-sortingDynamicPrio1"
        :options="sortingDynamicInheritExtra"
        :custom-label="(option) => $dynamicEditorTranslation(option)"
        :allow-empty="false"
        class="cursor-pointer"
        deselect-label="Selected"
      />
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('sortingLabel2') }}</UiFormLabel>
      </div>

      <Multiselect
        v-model="sortingDynamicPrio2"
        :custom-label="(option) => $dynamicEditorTranslation(option)"
        data-testid="editor-internal-sortingDynamicPrio2"
        :options="sortingDynamicInheritExtra"
        :allow-empty="false"
        class="cursor-pointer"
        deselect-label="Selected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';
const { updateSetting, getJsonSetting } = useSiteSettings('sortingDynamicInherit');
const { updateSetting: updateSettingProp1, getSetting: getSettingProp1 } = useSiteSettings('sortingDynamicPrio1');
const { updateSetting: updateSettingProp2, getSetting: getSettingProp2 } = useSiteSettings('sortingDynamicPrio2');
const { $dynamicEditorTranslation } = useNuxtApp();

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
  get: () => {
    const values: string[] = getJsonSetting() || [];
    return fromItemSortingOptions.value.filter((option) => values.includes(option));
  },
  set: (selectedOptions: string[]) => {
    updateSetting(JSON.stringify(selectedOptions));
  },
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
    "label": "Variation on item title",
    "placeholderForSortingInherit": "Adopt title sorting from item sorting",
    "sortingLabel1": "Sorting option 1",
    "sortingLabel2": "Sorting option 2",
    "description": "Use the following sorting options to determine which variation is shown on an item tile, for instance in the category page. Use the first selection to determine whether the item sorting option that the customer selects in the shop should also apply to the sorting of variations on the item tile. In this case, the selected sorting value serves as the first sorting value for the item tile. The first and second sorting options below only become effective if no clear order can be derived from the adopted item sorting, or if the adopted item sorting is not used. Sorting options that contradict each other (e.g. Manufacturer A-Z and Manufacturer Z-A) are neglected in the sorting."
  },
  "de": {
    "label": "Variation on item title",
    "placeholderForSortingInherit": "Adopt title sorting from item sorting",
    "sortingLabel1": "Sorting option 1",
    "sortingLabel2": "Sorting option 2",
    "description": "Use the following sorting options to determine which variation is shown on an item tile, for instance in the category page. Use the first selection to determine whether the item sorting option that the customer selects in the shop should also apply to the sorting of variations on the item tile. In this case, the selected sorting value serves as the first sorting value for the item tile. The first and second sorting options below only become effective if no clear order can be derived from the adopted item sorting, or if the adopted item sorting is not used. Sorting options that contradict each other (e.g. Manufacturer A-Z and Manufacturer Z-A) are neglected in the sorting."
  }
}
</i18n>
