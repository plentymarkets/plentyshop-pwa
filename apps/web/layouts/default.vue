<template>
  <div>
    <UiHeader />
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <Cookiebar />
    <LazyUiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <LazyPreviewMode hydrate-on-visible />
    <LazyUiFooter hydrate-on-visible />
    <LazyQuickCheckout v-if="isOpen" :product="product" />
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
defineProps<DefaultLayoutProps>();
const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
setLogoMeta();
</script>
