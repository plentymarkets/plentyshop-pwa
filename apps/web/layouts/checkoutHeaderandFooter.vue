<template>
    <div>
      <UiSimplifiedHeader/>
      <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
        <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
      </NarrowContainer>
      <main>
        <slot />
      </main>
      <NuxtLazyHydrate when-idle>
        <Cookiebar />
        <PreviewMode />
      </NuxtLazyHydrate>
      <NuxtLazyHydrate when-visible>
      <UiFooter />
      </NuxtLazyHydrate>
      <QuickCheckout v-if="isOpen" :product="product" />
    </div>
  </template>
  
  <script setup lang="ts">
  import type { DefaultLayoutProps } from '~/layouts/types';
  usePageTitle();
  
  defineProps<DefaultLayoutProps>();
  
  const { setLogoMeta } = useStructuredData();
  const { isOpen, product } = useQuickCheckout();
  const viewport = useViewport();
  
  setLogoMeta();
  </script>
  