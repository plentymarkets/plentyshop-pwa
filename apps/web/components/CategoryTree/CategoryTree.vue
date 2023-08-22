<template>
  <div
    class="py-2 px-4 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
    data-testid="category-tree"
  >
    {{ $t('category') }}
  </div>
  <template v-if="parent">
    <CategoryTreeItem :name="parent.name" :href="parent.href" :count="parent.count">
      <SfIconArrowBack size="sm" class="text-neutral-500 mr-2" />
    </CategoryTreeItem>
  </template>
  <ul class="mt-4 mb-6 md:mt-2" data-testid="categories">
    <CategoryTreeItem
      v-for="(category, index) in categories"
      :key="index"
      :name="categoryTreeGetters.getName(category)"
      :href="categoryTreeGetters.generateCategoryLink(categoryTree, category)"
      :count="categoryTreeGetters.getCount(category)"
    />
  </ul>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfIconArrowBack } from '@storefront-ui/vue';
import type { CategoryTreeProps } from '~/components/CategoryTree/types';

const { data: categoryTree } = useCategoryTree();

defineProps<CategoryTreeProps>();
</script>
