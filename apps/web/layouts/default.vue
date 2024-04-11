<template>
  <div>
    <UiHeader />
    <template v-if="breadcrumbs?.length">
      <NarrowContainer class="p-4 md:px-0">
        <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
      </NarrowContainer>
    </template>
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <UiNavbarBottom v-if="isTablet" />
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
const { isTablet } = useBreakpoints();

setLogoMeta();
</script>
