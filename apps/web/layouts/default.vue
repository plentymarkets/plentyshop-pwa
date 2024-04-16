<template>
  <div>
    <UiHeader />
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <UiNavbarBottom v-if="viewport.isLessThan('md')" />
      <Cookiebar />
      <PreviewMode />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <UiFooter />
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
usePageTitle();

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const viewport = useViewport();

setLogoMeta();
</script>
