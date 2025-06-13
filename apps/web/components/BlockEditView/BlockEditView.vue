<template>
  <div class="site-settings-view sticky top-[52px]">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getBlockTypeName(blockType) }}
      </div>
      <button class="!p-0" @click="drawerOpen = false">
        <SfIconClose />
      </button>
    </header>
    <div class="h-[calc(100vh-150px)] overflow-y-auto">
      <component :is="getComponent(blockType)" v-if="getComponent(blockType)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const { drawerOpen, blockType } = useSiteConfiguration();

const modules = import.meta.glob('@/components/**/blocks/**/*Form.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const getComponent = (name: string) => {
  if (!name) return null;

  const regex = new RegExp(`${blockType.value}Form\\.vue$`, 'i');
  const matched = Object.keys(modules).find((path) => regex.test(path));

  if (matched) {
    return defineAsyncComponent(modules[matched]) || '';
  }

  return '';
};

const blockTypeNames: Record<string, string> = {
  Carousel: 'Image Banner',
  NewsletterSubscribe: 'Newsletter',
  ProductRecommendedProducts: 'Product Gallery',
  TextCard: 'Rich Text',
  MultiGrid: 'Image + Text',
};

const getBlockTypeName = (blockType: string) => {
  return blockTypeNames[blockType] ?? blockType;
};
</script>
