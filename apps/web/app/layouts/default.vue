<template>
  <div>
    <EditableHeader
      :is-all-sticked="isAllSticked"
      :is-sticked-top="isStickedTop"
      :is-sticked-bottom="isStickedBottom"
      :is-sticked-middle="isStickedMiddle"
    >
      <template #top>
        <div class="w-full bg-blue-400 text-center py-2">
          test 1
          <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="toggleAll">
            toggle all
          </button>
          <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="toggleTop">
            toggle top
          </button>
        </div>
      </template>
      <template #middle>
        <div class="w-full bg-red-500 text-center py-2">
          test 2
          <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="toggleMiddle">
            toggle middle
          </button>
        </div>
      </template>
      <template #bottom>
        <div class="w-full bg-green-600 text-center py-2">
          Test 3 with Menu
          <button class="ml-4 px-2 py-0.5 bg-white/30 rounded text-sm" @click="toggleBottom">
            toggle bottom
          </button>
          <UiHeader />
        </div>
      </template>
    </EditableHeader>

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
import { id } from 'happy-dom/lib/PropertySymbol';

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
const route = useRoute();

const isAllSticked = ref(false);
const isStickedTop = ref(false);
const isStickedBottom = ref(true);
const isStickedMiddle = ref(false);

const toggleAll = () => {
  isAllSticked.value = !isAllSticked.value;
  isStickedTop.value = false;
  isStickedBottom.value = false;
  isStickedMiddle.value = false;
};

const toggleTop = () => {
  isStickedTop.value = !isStickedTop.value;
  isStickedBottom.value = false;
  isAllSticked.value = false;
  isStickedMiddle.value = false;
};

const toggleBottom = () => {
  isStickedBottom.value = !isStickedBottom.value;
  isStickedTop.value = false;
  isAllSticked.value = false;
  isStickedMiddle.value = false;
};

const toggleMiddle = () => {
  isStickedMiddle.value = !isStickedMiddle.value;
  isStickedTop.value = false;
  isStickedBottom.value = false;
  isAllSticked.value = false;
};

setLogoMeta();
</script>