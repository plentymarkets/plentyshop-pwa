<template>
  <div>
    <UiHeader />
    <main
      :class="[
        'mx-auto px-4 pt-4 md:px-0 md:mt-4',
        { 'md:mb-8': heading },
        heading ? 'md:max-w-[630px]' : 'md:max-w-[677px]',
      ]"
    >
      <h1 v-if="heading" class="font-bold mb-10 typography-headline-3 md:typography-headline-2">{{ heading }}</h1>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <UiNavbarBottom v-if="viewport.isLessThan('md')" />
      <Cookiebar />
      <PreviewMode />
    </NuxtLazyHydrate>
    <PageBlock
      v-for="(block, index) in footerBlocks"
      :key="block.meta.uuid"
      :block="block"
      :index="index"
      :root="true"
      :enable-actions="false"
      :is-clicked="false"
      :clicked-block-index="null"
      :is-tablet="false"
      :change-block-position="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';

defineProps<{
  heading: string;
}>();

const viewport = useViewport();

const { globalBlocksCache } = useGlobalBlocks();
const footerBlocks = computed(
  () => (globalBlocksCache.value?.filter((block: Block) => block.name === 'Footer') ?? []) as Block[],
);
</script>
