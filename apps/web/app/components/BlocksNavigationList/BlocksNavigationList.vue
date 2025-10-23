<template>
  <template v-for="(category, categoryIndex) in blocksLists" :key="categoryIndex">
    <UiAccordionItem
      v-if="pageHasAccessToCategory(category)"
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
              :disabled="isAddDisabled(category, variation, targetUuid)"
              :class="{
                'cursor-not-allowed opacity-50': isAddDisabled(category, variation, targetUuid),
              }"
              @click="
                drawerOpen = false;
                addNewBlock(category.category, variationIndex, targetUuid, blockPosition);
              "
            >
              <SfTooltip
                v-if="isSingleInstanceOnPage(variation.template.en.name)"
                :label="getEditorTranslation('errorMessages.editor.add.disabledOneInstancePerPage')"
                placement="top"
                :show-arrow="true"
              >
                <SfIconAdd />
              </SfTooltip>
              <SfIconAdd v-else />
            </button>
          </div>
        </div>
        <div
          v-if="isNestedMultigrid(category, targetUuid)"
          class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600"
        >
          <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
          <span class="italic">{{ getEditorTranslation('errorMessages.editor.add.disabledTooDeeplyNested') }}</span>
        </div>
        <div
          v-if="isForbiddenBlock(category, targetUuid)"
          class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600"
        >
          <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
          <span class="italic">{{
            getEditorTranslation('errorMessages.editor.add.disabledNotCompatibleWithLayouts')
          }}</span>
        </div>
      </div>
    </UiAccordionItem>
  </template>
</template>

<script setup lang="ts">
import { SfIconAdd, SfIconWarning, SfTooltip } from '@storefront-ui/vue';
import type { Category, Variation } from '~/components/BlocksNavigationList/types';
const { blocksLists, blocksListContext, visiblePlaceholder, addNewBlock, getBlockDepth, getBlocksLists } =
  useBlockManager();
getBlocksLists();
const { drawerOpen } = useSiteConfiguration();
const { multigridColumnUuid, blockExistsOnPage } = useBlockManager();
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const targetUuid = computed(() => multigridColumnUuid.value || visiblePlaceholder.value.uuid);
const isNestedMultigrid = (category: Category, uuid: string) => {
  return category.blockName === 'MultiGrid' && getBlockDepth(uuid) > 0;
};
const isForbiddenBlock = (category: Category, uuid: string) => {
  return ['BannerCarousel', 'ImageText'].includes(category.blockName) && getBlockDepth(uuid) > 0;
};
const isSingleInstanceBlock = (blockName: string) => {
  return ['SortFilter', 'ItemGrid'].includes(blockName);
};
const isSingleInstanceOnPage = (blockName: string) => {
  return isSingleInstanceBlock(blockName) && blockExistsOnPage(blockName);
};
const isAddDisabled = (category: Category, variation: Variation, uuid: string): boolean => {
  const blockName = variation.template.en.name;
  const isNested = isNestedMultigrid(category, uuid);
  const isForbidden = isForbiddenBlock(category, uuid);
  const isSingleInstance = isSingleInstanceOnPage(blockName);
  return isNested || isForbidden || isSingleInstance;
};

const blockPosition = computed(() => {
  if (multigridColumnUuid.value) return 'inside';
  return visiblePlaceholder.value.position;
});

const pageHasAccessToCategory = (category: Category) => {
  if (runtimeConfig.public.isDev) {
    return true;
  }

  if (blocksListContext.value) {
    const accessControl = category.accessControl || null;
    return accessControl?.includes(blocksListContext.value);
  }
};
</script>
