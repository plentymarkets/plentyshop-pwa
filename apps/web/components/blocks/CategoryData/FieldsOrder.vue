<template>
  <template v-for="key in content.fieldsOrder" :key="key">
    <template v-if="content.fields[key]">
      <h1
        v-if="key === 'name' && name"
        id="category-headline"
        :key="key"
        class="font-bold typography-headline-3 md:typography-headline-2"
        data-testid="category-name"
      >
        {{ name }}
      </h1>

      <p
        v-if="key === 'description1' && description1"
        :key="key"
        data-testid="category-description-1"
        v-html="description1"
      />

      <p
        v-if="key === 'description2' && description2"
        :key="key"
        data-testid="category-description-2"
        v-html="description2"
      />

      <p
        v-if="key === 'shortDescription' && shortDescription"
        :key="key"
        data-testid="category-short-description"
        v-html="shortDescription"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import { type Category, categoryGetters } from '@plentymarkets/shop-api';
import { CategoryDataContent } from './types';

const content = defineProps<CategoryDataContent>();
const { data: productsCatalog } = useProducts();

const category = computed(() => productsCatalog.value.category || ({} as Category));
const name = computed(() => categoryGetters.getCategoryName(category.value) || '');
const description1 = computed(() => categoryGetters.getCategoryDescription1(category.value) || '');
const description2 = computed(() => categoryGetters.getCategoryDescription2(category.value) || '');
const shortDescription = computed(() => categoryGetters.getCategoryShortDescription(category.value) || '');
</script>
