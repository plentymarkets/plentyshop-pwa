<template>
  <div class="mt-4">
    <p class="mb-4">Note: These settings are only applied after saving the changes and reloading the page</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>First sorting option</UiFormLabel>
      <SfTooltip label="First sorting option" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
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
import type { SortingOption } from '~/components/settings/category/sorting/category-sorting/types';
import { getRecommendedSortingOptions } from '~/utils/sortingOptionsHelper';

const { updateSetting, getSetting } = useSiteSettings('recommendedFirstSortingOption');

const sortingOptions = computed(() => getRecommendedSortingOptions('en', false));

const recommendedFirstSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
  },
});
</script>
