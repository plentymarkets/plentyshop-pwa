<template>
  <SfAccordionItem v-if="facet" v-model="open">
    <template #summary>
      <div class="flex justify-between p-2 mb-2">
        <p class="mb-2 font-medium typography-headline-5">{{ facetGetters.getName(facet) }}</p>
        <SfIconChevronLeft :class="['text-neutral-500', open ? 'rotate-90' : '-rotate-90']" />
      </div>
    </template>
    <!-- TODO: implement filters -->

    <!--    <ul v-if="facetGetters.getType(facet) === 'size'" class="flex flex-wrap gap-4 px-1.5">-->
    <!--      <li v-for="{ value } in facetGetters.getFilters(facet)" :key="value">-->
    <!--        <SfChip size="sm" :input-props="{ value: value }" v-model="selectedProxy">-->
    <!--          <span class="leading-4">{{ value }}</span>-->
    <!--        </SfChip>-->
    <!--      </li>-->
    <!--    </ul>-->

    <!--    <template v-if="facetGetters.getType(facet) === 'color'">-->
    <!--      <SfListItem-->
    <!--        v-for="{ value, label, productCount } in facetGetters.getFilters(facet)"-->
    <!--        :key="value"-->
    <!--        tag="label"-->
    <!--        size="sm"-->
    <!--        :class="['px-1.5 bg-transparent hover:bg-transparent', { 'font-medium': isItemActive(value) }]"-->
    <!--        :selected="isItemActive(value)"-->
    <!--      >-->
    <!--        <template #prefix>-->
    <!--          <input v-model="selectedProxy" :value="value" class="appearance-none peer" type="checkbox" />-->
    <!--          <span-->
    <!--            class="inline-flex items-center justify-center p-1 transition duration-300 rounded-full cursor-pointer -->
    <!--            ring-1 ring-neutral-200 ring-inset outline-offset-2 outline-secondary-600 peer-checked:ring-2 -->
    <!--            peer-checked:ring-primary-700 peer-hover:bg-primary-100 -->
    <!--            peer-[&:not(:checked):hover]:ring-primary-200 peer-active:bg-primary-200 peer-active:ring-primary-300 -->
    <!--            peer-disabled:cursor-not-allowed peer-disabled:bg-disabled-100 peer-disabled:opacity-50 -->
    <!--            peer-disabled:ring-1 peer-disabled:ring-disabled-200 peer-disabled:hover:ring-disabled-200 -->
    <!--            peer-checked:hover:ring-primary-700 peer-checked:active:ring-primary-700 peer-focus-visible:outline"-->
    <!--          >-->
    <!--            <SfThumbnail size="sm" :style="{ backgroundColor: value }" />-->
    <!--          </span>-->
    <!--        </template>-->
    <!--        <p>-->
    <!--          <span class="mr-2 typography-text-sm">{{ label }}</span>-->
    <!--          <SfCounter size="sm">{{ productCount }}</SfCounter>-->
    <!--        </p>-->
    <!--      </SfListItem>-->
    <!--    </template>-->
  </SfAccordionItem>
</template>

<script setup lang="ts">
import { facetGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfAccordionItem, SfIconChevronLeft } from '@storefront-ui/vue';
import type { FilterProps } from '~/components/CategoryFilters/types';

defineProps<FilterProps>();
// const emit = defineEmits<FilterEmits>();

const open = ref(true);
//
// const selectedProxy = computed({
//   get: () => props.selected,
//   set: (value: FilterProps['selected']) => emit('update:selected', value),
// });

// const isItemActive = (selectedValue: string) => props.selected.includes(selectedValue);
</script>
