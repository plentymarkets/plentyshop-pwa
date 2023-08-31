<template>
  <div
    v-if="parent || (categoryTreeItem && categoryTreeGetters.getItems(categoryTreeItem)?.length)"
    class="category-tree"
  >
    <div
      class="py-2 px-4 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
      data-testid="category-tree"
    >
      {{ $t('category') }}
    </div>
    <template v-if="parent">
      <CategoryTreeItem
        :name="categoryTreeGetters.getName(parent)"
        :href="categoryTreeGetters.generateCategoryLink(categoryTree, parent)"
        :count="categoryTreeGetters.getCount(parent)"
      >
        <SfIconArrowBack size="sm" class="text-neutral-500 mr-2" />
      </CategoryTreeItem>
    </template>
    <ul v-if="categoryTreeItem" class="mt-4 mb-6 md:mt-2" data-testid="categories">
      <CategoryTreeItem
        v-for="(categoryItem, index) in categoryTreeGetters.getItems(categoryTreeItem)"
        :key="index"
        :name="categoryTreeGetters.getName(categoryItem)"
        :href="categoryTreeGetters.generateCategoryLink(categoryTree, categoryItem)"
        :count="categoryTreeGetters.getCount(categoryItem)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/shop-sdk';
import { SfIconArrowBack } from '@storefront-ui/vue';

const { data: categoryTree } = useCategoryTree();
const { data: productsCatalog } = useProducts();

const category = ref(productsCatalog.value.category);

const categoryTreeItem = categoryTreeGetters.findCategoryById(categoryTree.value, category.value.id);
const parent = categoryTreeGetters.findCategoryById(categoryTree.value, category.value.parentCategoryId);
</script>
