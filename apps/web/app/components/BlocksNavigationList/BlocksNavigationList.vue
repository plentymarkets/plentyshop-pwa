<template>
  <div class="bg-[#F1F3F5] overflow-y-auto max-h-[100vh] pt-5 sticky top-0 px-2">
    <div class="overflow-y-auto">
      <div v-for="(category, categoryIndex) in blocksLists" :key="categoryIndex">
        <div :class="['mb-3 relative', 'md:text-center', 'lg:left-[15%] lg:text-left']">
          {{ category.title }}
        </div>
        <div v-for="(variation, variationIndex) in category.variations" :key="variationIndex" class="relative mb-10">
          <NuxtImg :src="variation.image" class="block mx-auto" :alt="variation.title" width="253" height="120" />
          <button
            :class="[
              'transform -translate-y-1/2 bg-[#72CBEE] text-[#062633] w-10 h-10 rounded-full shadow-md cursor-pointer',
              'md:block md:mx-auto',
              'lg:right-[15%] lg:absolute',
            ]"
            :data-testid="'block-add-' + categoryIndex + '-' + variationIndex"
            @click="
              drawerOpen = false;
              addNewBlock(category.category, variationIndex, visiblePlaceholder.uuid, visiblePlaceholder.position);
            "
          >
            <SfIconAdd class="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';

const { blocksLists, getBlocksLists } = useBlockManager();
getBlocksLists();

const { addNewBlock, visiblePlaceholder } = useBlockManager();
const { drawerOpen } = useSiteConfiguration();
</script>
