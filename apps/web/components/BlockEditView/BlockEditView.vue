<template>
  <div class="site-settings-view sticky top-[52px]">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Block Editing</div>
      <button class="!p-0" @click="drawerOpen = false">
        <SfIconClose />
      </button>
    </header>

    <component :is="getComponent(blockType)" v-if="getComponent(blockType)" />
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const { drawerOpen, blockType } = useSiteConfiguration();

const modules = import.meta.glob('@/components/**/blocks/**/*Form.vue') as Record<
  string,
  () => Promise<{ default: any }>
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
</script>
