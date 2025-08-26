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
            :disabled="isNestedMultigrid(category, targetUuid) || isForbiddenBlock(category, targetUuid)"
            :class="{
              'cursor-not-allowed opacity-50':
                isNestedMultigrid(category, targetUuid) || isForbiddenBlock(category, targetUuid),
            }"
            @click="
              drawerOpen = false;
              addNewBlock(category.category, variationIndex, targetUuid, blockPosition);
            "
          >
            <SfIconAdd />
          </button>
        </div>
      </div>
      <div
        v-if="isNestedMultigrid(category, targetUuid)"
        class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600"
      >
        <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
        <span class="italic">{{ t('errorMessages.editor.add.disabledTooDeeplyNested') }}</span>
      </div>
      <div
        v-if="isForbiddenBlock(category, targetUuid)"
        class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600"
      >
        <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
        <span class="italic">{{ t('errorMessages.editor.add.disabledNotCompatibleWithLayouts') }}</span>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfIconAdd, SfIconWarning } from '@storefront-ui/vue';
import type { Category } from '~/components/BlocksNavigationList/types';
const { blocksLists, getBlocksLists } = useBlockManager();
getBlocksLists();

const { addNewBlock, visiblePlaceholder, getBlockDepth } = useBlockManager();
const { drawerOpen } = useSiteConfiguration();
const { multigridColumnUuid } = useBlockManager();
const { t } = useI18n();

const targetUuid = computed(() => multigridColumnUuid.value || visiblePlaceholder.value.uuid);
const isNestedMultigrid = (category: Category, uuid: string) => {
  return category.blockName === 'MultiGrid' && getBlockDepth(uuid) > 0;
};
const isForbiddenBlock = (category: Category, uuid: string) => {
  return ['BannerCarousel', 'ImageText'].includes(category.blockName) && getBlockDepth(uuid) > 0;
};
const blockPosition = computed(() => {
  if (multigridColumnUuid.value) return 'inside';
  return visiblePlaceholder.value.position;
});
</script>
