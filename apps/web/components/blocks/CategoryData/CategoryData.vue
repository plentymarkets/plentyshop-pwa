<template>
  <div>
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

const props = withDefaults(defineProps<CategoryDataProps>(), {
  name: undefined,
  type: undefined,
  content: undefined,
  configuration: undefined,
  index: 0,
  meta: () => ({
    uuid: '',
  }),
  shouldLoad: undefined,
});

const { data: productsCatalog } = useProducts();

const title = computed(() => categoryGetters.getCategoryName(productsCatalog.value.category));
</script>
