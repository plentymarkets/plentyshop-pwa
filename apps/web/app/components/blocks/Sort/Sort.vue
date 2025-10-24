<template>
  <section

    data-testid="category-sort"
    aria-label="Sort products"
  >
    <CategorySorting class="mb-4" />ujhygfgh
  </section>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import type { SortProps } from './types.ts'


const props = defineProps<SortProps>()


// const isVisible = computed(() => !!props.content?.fields?.sortBy)
</script>
