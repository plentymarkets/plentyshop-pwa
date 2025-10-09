<template>
  <div class="site-settings-view sticky top-[52px]">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getBlockTypeName(blockType) }}
      </div>
      <div class="flex items-center space-x-2">
        <div v-if="blockType !== 'Footer'" class="flex items-center space-x-2">
          <button @click="deleteBlock(blockUuid)">
            <SfIconDelete />
          </button>
          <div class="w-px h-4 bg-gray-300" />
        </div>
        <button @click="drawerOpen = false">
          <SfIconClose />
        </button>
      </div>
    </header>
    <div class="h-[80vh] overflow-y-auto">
      <component :is="getComponent(blockType)" v-if="getComponent(blockType)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconClose } from '@storefront-ui/vue';

const { drawerOpen, blockType, blockUuid } = useSiteConfiguration();
const { deleteBlock } = useBlockManager();

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
  MultiGrid: 'Layout',
  Footer: 'Footer',
};

const getBlockTypeName = (blockType: string) => {
  return blockTypeNames[blockType] ?? blockType;
};
</script>
