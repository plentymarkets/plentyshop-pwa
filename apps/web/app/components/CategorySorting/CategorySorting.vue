<template>
  <div class="w-full" data-testid="category-sorting">
    <h6
      v-if="!selectionModeCompact"
      class="bg-primary-50/50 mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none"
    >
      {{ t('sortBy') }}
    </h6>

    <div class="px-4">
      <SfSelect id="sortBy" v-model="selected" :aria-label="t('sortBy')" data-testid="select-sort-by">
        <option v-if="selectionModeCompact" value="" disabled hidden>{{ t('sortBy') }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ t(`sortType.${option}`) }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { useRoute } from 'vue-router';
import { isPageOfType } from '~/utils/pathHelper';

const props = defineProps<{ selectionModeCompact?: boolean }>();
const { updateSorting } = useCategoryFilter();
const { t } = useI18n();
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { getSetting: defaultSortingSearch } = useSiteSettings('defaultSortingSearch');
const { getSetting: defaultSortingOption } = useSiteSettings('defaultSortingOption');

const route = useRoute();
const useSelectionModeCompact = computed(() => props.selectionModeCompact);
watch(useSelectionModeCompact, (on) => {
  if (on) updateSorting('');
});
const options = computed<string[]>(() => availableSortingOptions());
const defaultOption = computed<string | undefined>(() =>
  isPageOfType('search') ? defaultSortingSearch() : defaultSortingOption(),
);

const selected = computed<string>({
  get: () => {
    if (useSelectionModeCompact.value) return '';

    const sortQueryParam = route.query.sort;
    const currentSort = typeof sortQueryParam === 'string' ? sortQueryParam : '';
    if (currentSort && options.value.includes(currentSort)) return currentSort;

    return (
      (defaultOption.value && options.value.includes(defaultOption.value) ? defaultOption.value : options.value[0]) ??
      ''
    );
  },
  set: (val) => {
    if (!val) return;
    updateSorting(val);
  },
});
</script>
