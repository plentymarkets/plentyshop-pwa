<template>
  <div class="flex items-center justify-between px-5 py-6 border-b border-[#F1F3F5]">
    <div class="font-bold text-[#062633]">Block settings</div>
    <button @click="drawerOpen = false">
      <SfIconClose />
    </button>
  </div>
  <component :is="getBlock(blockType)" v-if="blockType" />
</template>
<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
const { drawerOpen, blockType } = useSiteConfiguration();
const tempBlockPlaceholder = defineComponent({
  setup() {
    return () => {
      return h('h1', 'This block is not implemented yet!');
    };
  },
});
const getBlock = (view: string) => {
  if (view === 'UiCarousel') return resolveComponent('BlockSlider');
  else return tempBlockPlaceholder;
};
</script>
