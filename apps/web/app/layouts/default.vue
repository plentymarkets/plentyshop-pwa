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
      <UiFooterBlocks />
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';

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

setLogoMeta();
</script>
