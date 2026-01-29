<template>
  <template v-for="key in renderOrder" :key="key">
    <template v-if="fields?.[key]">
      <h1
        v-if="key === 'name' && texts.name"
        id="category-headline"
        class="font-bold typography-headline-3 md:typography-headline-2"
        data-testid="category-name"
      >
        {{ texts.name }}
      </h1>

      <div
        v-else-if="key === 'description1' && texts.description1"
        data-testid="category-description-1"
        v-html="texts.description1"
      />

      <div
        v-else-if="key === 'description2' && texts.description2"
        data-testid="category-description-2"
        v-html="texts.description2"
      />

      <div
        v-else-if="key === 'shortDescription' && texts.shortDescription"
        data-testid="category-short-description"
        v-html="texts.shortDescription"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
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
