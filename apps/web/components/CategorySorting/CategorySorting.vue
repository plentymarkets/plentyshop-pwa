<template>
  <div class="w-full md:max-w-[376px]" data-testid="category-sorting">
    <h6
      class="bg-neutral-100 mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none"
    >
      {{ t('sortBy') }}
    </h6>
    <div class="px-4">
      <SfSelect id="sortBy" v-model="selected" :aria-label="t('sortBy')" data-testid="select-sort-by">
        <option v-for="option in options" :key="option" :value="option">
          {{ t(`sortType.${option}`) }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';

const { updateSorting } = useCategoryFilter();
const { t } = useI18n();
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { getSetting: defaultSortingSearch } = useSiteSettings('defaultSortingSearch');
const { getSetting: defaultSortingOption } = useSiteSettings('defaultSortingOption');

const options = computed(() => availableSortingOptions());

const defaultOption = computed(() =>
  useNuxtApp().$router.currentRoute.value.path === '/search' ? defaultSortingSearch() : defaultSortingOption(),
);

const selected = computed({
  get: () => {
    return (useNuxtApp().$router.currentRoute.value.query.sort || defaultOption.value || options.value[0]) as string;
  },
  set: (selectedOption) => {
    updateSorting(selectedOption);
  },
});
</script>
