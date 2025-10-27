<template>
  <div class="w-full" data-testid="category-sorting">
    <h6
      class="bg-primary-50/50 mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none"
    >
      {{ t('sortBy') }}
    </h6>
    <div class="px-4">
      <SfSelect id="sortBy" v-model="selected" :aria-label="t('sortBy')" data-testid="select-sort-by">
        <option v-for="option in filteredOptions" :key="option" :value="option">
          {{ t(`sortType.${option}`) }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { isPageOfType } from '~/utils/pathHelper';

const { updateSorting } = useCategoryFilter();
const { t } = useI18n();
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { getSetting: defaultSortingSearch } = useSiteSettings('defaultSortingSearch');
const { getSetting: defaultSortingOption } = useSiteSettings('defaultSortingOption');

const options = computed(() => availableSortingOptions());
const isSearchPage = computed(() => isPageOfType('search'));

const filteredOptions = computed(() => {
  const availableOptions = options.value || [];

  if (!isSearchPage.value) {
    return availableOptions.filter((option: string) => option !== 'item.score');
  }
  return availableOptions;
});

const defaultOption = computed(() => (isSearchPage.value ? defaultSortingSearch() : defaultSortingOption()));

const selected = computed({
  get: () => {
    return (useNuxtApp().$router.currentRoute.value.query.sort ||
      defaultOption.value ||
      filteredOptions.value[0]) as string;
  },
  set: (selectedOption) => {
    updateSorting(selectedOption);
  },
});
</script>
