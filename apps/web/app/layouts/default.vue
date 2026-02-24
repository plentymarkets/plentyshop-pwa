<template>
  <div>
    <EditableHeader
      :is-all-sticked="isAllSticked"
      :is-sticked-top="isStickedTop"
      :is-sticked-bottom="isStickedBottom"
      @toggle-all="toggleAll"
      @toggle-top="toggleTop"
      @toggle-bottom="toggleBottom"
    />
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main class="relative z-0">
      <slot />
    </main>
    <UiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <Cookiebar />
    <PreviewMode />
    <ClientOnly>
      <FooterBlock v-if="!route.meta.isBlockified" />
    </ClientOnly>
    <QuickCheckout v-if="isOpen" :product="product" />
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
const route = useRoute();

const isAllSticked = ref(false);
const isStickedTop = ref(false);
const isStickedBottom = ref(true);

const toggleAll = () => {
  isAllSticked.value = !isAllSticked.value;
  isStickedTop.value = false;
  isStickedBottom.value = false;
};

const toggleTop = () => {
  isStickedTop.value = !isStickedTop.value;
  isStickedBottom.value = false;
  isAllSticked.value = false;
};

const toggleBottom = () => {
  isStickedBottom.value = !isStickedBottom.value;
  isStickedTop.value = false;
  isAllSticked.value = false;
};

setLogoMeta();
</script>