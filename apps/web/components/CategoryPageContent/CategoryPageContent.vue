<template>
  <NarrowContainer class="mb-20 px-4 md:px-0" data-testid="category-layout">
    <CategoryData />
    <div class="md:flex gap-6" data-testid="category-page-content">
      <CategorySidebar :is-open="isOpen" @close="close">
        <NuxtLazyHydrate when-visible>
          <slot name="sidebar" />
        </NuxtLazyHydrate>
      </CategorySidebar>
      <BlocksItemGrid v-bind="itemGrid"  />
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { useDisclosure } from '@storefront-ui/vue';
import CategoryData from '~/components/blocks/CategoryData/CategoryData.vue';

const { isOpen, close } = useDisclosure();
const { getCategoryTemplateBlock } = useCategoryTemplate();
const viewport = useViewport();

const itemGrid = getCategoryTemplateBlock('ItemGrid');

if (viewport.isLessThan('md')) close();
</script>
