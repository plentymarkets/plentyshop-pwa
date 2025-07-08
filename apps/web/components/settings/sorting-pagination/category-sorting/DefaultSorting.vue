<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Default Sorting</UiFormLabel>
      <SfTooltip
        label="Which sorting option do you want to preselect by default for the category view?"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="defaultSortingOption"
      data-testid="available-sorting-options"
      :options="sortingOptions"
      placeholder="Select default option"
      label="label"
      track-by="value"
      class="cursor-pointer"
      select-label=""
      deselect-label="Selected"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { SortingOption } from '~/components/settings/sorting-pagination/category-sorting/types';

const { updateSetting, getSetting } = useSiteSettings('defaultSortingOption');
const { getSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');

const { t: tEn } = useI18n({
  inheritLocale: false,
  locale: 'en',
});

const labelFor = (key: string): string => {
  return tEn(`sortType.${key}`);
};

const sortingOptions = computed(() => {
  const availableOptions = JSON.parse(availableSortingOptions());
  if (!availableOptions) return [];

  return availableOptions.map((key: string) => ({
    label: labelFor(key),
    value: key,
  }));
});

const defaultSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option.value);
  },
});
</script>
