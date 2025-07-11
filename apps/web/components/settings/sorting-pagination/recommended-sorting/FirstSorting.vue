<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ t('sortingAndPagination.recommendedSorting.firstSortingOptionLabel') }}</UiFormLabel>
      <SfTooltip
          :label="t('sortingAndPagination.recommendedSorting.firstSortingOptionLabel')"
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
import { getRecommendedSortingOptions } from '~/utils/sortingOptionsHelper';
const { t, locale } = useI18n();

const { updateSetting, getSetting } = useSiteSettings('recommendedFirstSortingOption');
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { updateSorting } = useCategoryFilter();

const sortingOptions = computed(() => getRecommendedSortingOptions(locale.value, false));
//
const recommendedFirstSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
  },
});
</script>
