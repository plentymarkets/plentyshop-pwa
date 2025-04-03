<template>
  <div class="w-full md:max-w-[376px]" data-testid="category-items-per-page">
    <h6
      class="bg-neutral-100 mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none"
    >
      {{ $t('perPage') }}
    </h6>

    <div class="px-4">
      <SfSelect
        id="perPage"
        v-model="selected"
        :aria-label="$t('perPage')"
      >
        <option v-for="{ value, label, disabled } in options" :key="value" :value="value" :disabled="disabled">
          {{ label }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import type { CategoryItemsPerPageProps } from '~/components/CategoryItemsPerPage/types';
import { defaults } from '~/composables';

const props = defineProps<CategoryItemsPerPageProps>();
const { itemsPerPage, updateItemsPerPage } = useProductFilters();

const maxValidOption = computed(() => {
  let firstHigherFound = false;
  let max = defaults.DEFAULT_ITEMS_PER_PAGE;

  for (const step of defaults.PER_PAGE_STEPS) {
    if (step <= props.totalProducts) {
      max = step;
    } else if (!firstHigherFound) {
      max = step;
      firstHigherFound = true;
    }
  }
  return max;
});

const options = computed(() =>
  defaults.PER_PAGE_STEPS.map((step: number) => ({
    label: step.toString(),
    value: step.toString(),
    disabled: step > maxValidOption.value
  }))
);

const selected = computed({
  get: () => {
    const current = itemsPerPage.value;
    return (current <= maxValidOption.value ? current : maxValidOption.value).toString();
  },
  set: (value) => {
    const numericValue = Number(value);
    const validValue = numericValue <= maxValidOption.value ? numericValue : maxValidOption.value;
    updateItemsPerPage(validValue);
  }
});
</script>
