<template>
  <h1 class="my-10 font-bold typography-headline-3 md:typography-headline-2" data-testid="category-name">
    {{ title }}
  </h1>
</template>

<script setup lang="ts">
import { categoryGetters } from '@plentymarkets/shop-api';

const { data: productsCatalog } = useProducts();

const title = computed(() => categoryGetters.getCategoryName(productsCatalog.value.category));
</script>
