<template>
  <UiToolbar v-if="isPreview" />
  <div :class="{ flex: displayBlockList }">
    <div v-if="displayBlockList" class="drawer w-1/4">
      <UiBlocksNavigation />
    </div>
    <div :class="{ 'flex-1': displayBlockList, 'w-full': !displayBlockList }" class="main-content">
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
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
defineProps<DefaultLayoutProps>();
const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const { displayBlockList } = useEditor();
const viewport = useViewport();
setLogoMeta();
const isPreview = ref(false);
onMounted(() => {
  const config = useRuntimeConfig().public;
  const showConfigurationDrawer = config.showConfigurationDrawer;

  const pwaCookie = useCookie('pwa');
  isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
});
</script>
