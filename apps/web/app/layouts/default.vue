<template>
  <div>
    <!-- <UiHeaderBlocks v-if="enableEditableHeader" />
    <UiHeader v-else /> -->
    <BlocksNavigationMenu />
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <UiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <Cookiebar />
    <PreviewMode />
    <UiFooterBlocks />
    <QuickCheckout v-if="isOpen" :product="product" />
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
import BlocksNavigationMenu from '~/components/blocks/Navigation/Navigation.vue';

defineProps<DefaultLayoutProps>();

// const { enableEditableHeader } = useRuntimeConfig().public;
const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();

setLogoMeta();
</script>
