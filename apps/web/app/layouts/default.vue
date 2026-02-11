<template>
  <div>
    <slot name="header">
      <UiSimplifiedHeader v-if="useSimplifiedHeader" />
      <UiHeader v-else />
    </slot>
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <UiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <Cookiebar />
    <PreviewMode />
    <QuickCheckout v-if="isOpen" :product="product" />
    <slot name="footer">
      <PageBlock
        v-for="(block, index) in footerBlocks"
        :key="block.meta.uuid"
        :block="block"
        :index="index"
        :root="true"
        :enable-actions="false"
        :is-clicked="false"
        :clicked-block-index="null"
        :is-tablet="false"
        :change-block-position="() => {}"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
import type { Block } from '@plentymarkets/shop-api';

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
const route = useRoute();

const useSimplifiedHeader = computed(() => {
  const path = route.path;
  return (
    path.includes('/cart') ||
    path.includes('/checkout') ||
    path.includes('/guest/login') ||
    path.includes('/readonly-checkout')
  );
});

const { globalBlocksCache } = useGlobalBlocks();
const footerBlocks = computed(
  () => (globalBlocksCache.value?.filter((block: Block) => block.name === 'Footer') ?? []) as Block[],
);

setLogoMeta();
</script>
