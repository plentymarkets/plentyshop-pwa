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
    <LazyPreviewMode hydrate-on-idle />
    <LazyFooterBlock v-if="runtimeConfig.public.isDev && !route.meta.isBlockified" />
    <LazyUiFooter v-if="!runtimeConfig.public.isDev" />
    <LazyQuickCheckout v-if="isOpen" :product="product" />
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
import LazyFooterBlock from '~/components/blocks/Footer/Footer.vue';

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const viewport = useViewport();

setLogoMeta();
</script>
