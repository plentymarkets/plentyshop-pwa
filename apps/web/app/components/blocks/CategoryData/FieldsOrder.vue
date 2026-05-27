<template>
  <div class="flex w-full min-w-0 max-w-full flex-col gap-2 sm:gap-3">
    <template v-for="key in renderOrder" :key="key">
      <template v-if="fields?.[key]">
        <h1
          v-if="key === 'name' && texts.name"
          id="category-headline"
          class="font-bold text-xl leading-tight break-words hyphens-auto xs:text-2xl sm:typography-headline-4 md:typography-headline-3 lg:typography-headline-2 max-w-full"
          data-testid="category-name"
        >
          {{ texts.name }}
        </h1>

        <div
          v-else-if="key === 'description1' && texts.description1"
          class="category-description"
          data-testid="category-description-1"
          v-html="texts.description1"
        />

        <div
          v-else-if="key === 'description2' && texts.description2"
          class="category-description"
          data-testid="category-description-2"
          v-html="texts.description2"
        />

        <div
          v-else-if="key === 'shortDescription' && texts.shortDescription"
          class="category-description"
          data-testid="category-short-description"
          v-html="texts.shortDescription"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type {
  CategoryDataFieldKey,
  CategoryDataFieldsVisibility,
  CategoryData,
} from '~/components/blocks/CategoryData/types';

const props = defineProps<{
  fields: CategoryDataFieldsVisibility;
  fieldsOrder: CategoryDataFieldKey[];
  texts: CategoryData;
}>();

const renderOrder = computed<CategoryDataFieldKey[]>(() =>
  props.fieldsOrder?.length
    ? props.fieldsOrder
    : (['name', 'description1', 'description2', 'shortDescription'] as CategoryDataFieldKey[]),
);
</script>

<style scoped>
.category-description {
  @apply w-full min-w-0 max-w-full text-sm leading-relaxed text-neutral-700 break-words sm:text-base;
}

.category-description :deep(p),
.category-description :deep(li),
.category-description :deep(a) {
  @apply max-w-full break-words;
}

.category-description :deep(p + p) {
  @apply mt-2;
}
</style>
