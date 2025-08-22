<template>
  <UiAccordionItem
    v-for="(category, categoryIndex) in blocksLists"
    :key="categoryIndex"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    :data-testid="'block-category-' + categoryIndex"
  >
    <template #summary>
      <h2>{{ category.title }}</h2>
    </template>
    <div class="px-4 py-4 mb-4">
      <div v-for="(variation, variationIndex) in category.variations" :key="variationIndex" class="mb-10">
        <div class="relative w-fit mx-auto">
          <NuxtImg :src="variation.image" class="block" :alt="variation.title" width="253" height="120" />
          <button
            class="absolute right-[-5px] top-[100%] -translate-y-1/2 bg-[#72CBEE] text-[#062633] w-10 h-10 rounded-full shadow-md"
            :data-testid="'block-add-' + categoryIndex + '-' + variationIndex"
            :disabled="isNestedMultigrid(category, targetUuid)"
            :class="{'cursor-not-allowed opacity-50': isNestedMultigrid(category, targetUuid)}"
            @click="
              drawerOpen = false;
              addNewBlock(category.category, variationIndex, targetUuid, visiblePlaceholder.position);
            "
          >
            <SfIconAdd />
          </button>
        </div>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { Category } from '~/components/BlocksNavigationList/types';
const { blocksLists, getBlocksLists } = useBlockManager();
getBlocksLists();

const { addNewBlock, visiblePlaceholder, getBlockDepth } = useBlockManager();
const { drawerOpen } = useSiteConfiguration();
const { multigridColumnUuid } = useBlockManager();

const targetUuid = computed(() => multigridColumnUuid.value || visiblePlaceholder.value.uuid);
const isNestedMultigrid = (category: Category, uuid: string) => {
  return category.blockName === 'MultiGrid' && getBlockDepth(uuid) > 0;
}
</script>
