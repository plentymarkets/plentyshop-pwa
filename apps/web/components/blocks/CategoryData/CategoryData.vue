<template>
  <div v-bind="$attrs">
    <h1
        class="my-10 font-bold typography-headline-3 md:typography-headline-2"
        data-testid="category-name"
        :index="props.index"
    >
      {{ title }}
    </h1>

  </div>
</template>

<script setup lang="ts">
import { categoryGetters } from '@plentymarkets/shop-api';
import type { CategoryDataProps } from './types';

const props = withDefaults(defineProps<CategoryDataProps>(), { shouldLoad: undefined });
const { data: productsCatalog } = useProducts();

const title = categoryGetters.getCategoryName(productsCatalog.category);

</script>
