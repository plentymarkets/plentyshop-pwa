<template>
  <div>
    <client-only>
      <UiToolbar v-show="isPreview" />
    </client-only>
    <UiHeader />
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <UiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <Cookiebar />
    <PreviewMode />
    <NuxtLazyHydrate when-visible>
      <UiFooter />
    </NuxtLazyHydrate>

    <QuickCheckout v-if="isOpen" :product="product" />
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
defineProps<DefaultLayoutProps>();
usePageTitle();
const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
setLogoMeta();
const isPreview = ref(false);

onMounted(() => {
  // const urlParams = new URLSearchParams(window.location.search);
  // if (urlParams.has('edit') && urlParams.get('edit') === 'true') {
  //   sessionStorage.setItem('isPreview',   'true');
  // }

  // const previewValue = sessionStorage.getItem('isPreview');
  // isPreview.value = previewValue === 'true';

  // I want to show the toolbar only if there is cookie named pwa set

  // Log all cookies
  console.log('All cookies:', document.cookie);

  const cookieExists = document.cookie.split('; ').some((cookie) => cookie.trim().startsWith('plenty-viewport='));

  isPreview.value = cookieExists;
  console.log('Cookie exists:', cookieExists);
});
</script>
