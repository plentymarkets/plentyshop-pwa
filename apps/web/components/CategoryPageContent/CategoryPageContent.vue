<template>
  <NarrowContainer class="mb-20 px-4 md:px-0" data-testid="category-layout">
    <BlocksCategoryData v-bind="categoryData" />
    <div class="md:flex gap-6" data-testid="category-page-content">
      <CategorySidebar :is-open="isOpen" @close="close">
        <NuxtLazyHydrate when-visible>
          <slot name="sidebar" />
        </NuxtLazyHydrate>
      </CategorySidebar>
      <BlocksItemGrid
        v-bind="itemGrid"
        :total-products="totalProducts"
        :products-per-page="itemsPerPage"
        :products="products"
      />
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { useDisclosure } from '@storefront-ui/vue';
import type { CategoryPageContentProps } from '~/components/CategoryPageContent/types';

const { totalProducts, itemsPerPage = 24, products = [] } = defineProps<CategoryPageContentProps>();

const { isOpen, close } = useDisclosure();
const { getCategoryTemplateBlock, getCategoryDataTemplateBlock } = useCategoryTemplate();
const viewport = useViewport();

const itemGrid = getCategoryTemplateBlock();
const categoryData = getCategoryDataTemplateBlock();

if (viewport.isLessThan('md')) close();
</script>
