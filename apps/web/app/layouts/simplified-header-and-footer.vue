<template>
  <div>
    <UiHeader />
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
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

usePageTitle();
useStructuredData().setLogoMeta();

const { globalBlocksCache } = useGlobalBlocks();
const footerBlocks = computed(
  () => (globalBlocksCache.value?.filter((block: Block) => block.name === 'Footer') ?? []) as Block[],
);
</script>
