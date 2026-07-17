<template>
  <template v-for="(category, categoryIndex) in blocksLists" :key="categoryIndex">
    <EditorFormPanel
      v-if="pageHasAccessToCategory(category)"
      :title="category.title"
      :data-testid="'block-category-' + categoryIndex"
    >
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
              @click="handleAddBlock(category.category, variationIndex)"
            >
              <SfTooltip
                v-if="isSingleInstanceOnPage(variation.template.en.name)"
                :label="getEditorTranslation('disabledOneInstancePerPage')"
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
          <span class="italic">{{ getEditorTranslation('disabledTooDeeplyNested') }}</span>
        </div>
        <div
          v-if="isForbiddenBlock(category, targetUuid)"
          class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600"
        >
          <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
          <span class="italic">{{ getEditorTranslation('disabledNotCompatibleWithLayouts') }}</span>
        </div>
      </div>
    </EditorFormPanel>
  </template>
</template>

<script setup lang="ts">
import { SfIconAdd, SfIconWarning, SfTooltip } from '@storefront-ui/vue';
import type { BlockListCategory, BlockTemplateVariation } from '~/composables/useBlocksList/types';

const { blocksLists, pageHasAccessToCategory, getBlocksLists } = useBlocksList();

await getBlocksLists();

const { closeSiteConfigurationDrawer } = useSiteConfiguration();
const { visiblePlaceholder, addNewBlock, getBlockDepth, blockExistsOnPage } = useBlockManager();
const { insertColumnUuid } = useBlocksMutations();

const targetUuid = computed(() => insertColumnUuid.value || visiblePlaceholder.value.uuid);
const isNestedMultigrid = (category: BlockListCategory, uuid: string) => {
  return category.blockName === 'MultiGrid' && getBlockDepth(uuid) > 0;
};
const isForbiddenBlock = (category: BlockListCategory, uuid: string) => {
  return ['BannerCarousel', 'ImageText'].includes(category.blockName) && getBlockDepth(uuid) > 0;
};
const isSingleInstanceBlock = (blockName: string) => {
  return ['SortFilter', 'ItemGrid', 'Navigation'].includes(blockName);
};
const isSingleInstanceOnPage = (blockName: string) => {
  return isSingleInstanceBlock(blockName) && blockExistsOnPage(blockName);
};
const isAddDisabled = (category: BlockListCategory, variation: BlockTemplateVariation, uuid: string): boolean => {
  const blockName = variation.template.en.name;
  const isNested = isNestedMultigrid(category, uuid);
  const isForbidden = isForbiddenBlock(category, uuid);
  const isSingleInstance = isSingleInstanceOnPage(blockName);
  return isNested || isForbidden || isSingleInstance;
};

const blockPosition = computed(() => {
  if (insertColumnUuid.value) return 'inside';
  return visiblePlaceholder.value.position;
});

const handleAddBlock = (categoryName: string, variationIndex: number) => {
  closeSiteConfigurationDrawer();
  addNewBlock(categoryName, variationIndex, targetUuid.value, blockPosition.value);
};
</script>

<i18n lang="json">
{
  "en": {
    "disabledNotCompatibleWithLayouts": "This block can't be placed inside a layout.",
    "disabledOneInstancePerPage": "You can only have 1 instance of this block type on a page.",
    "disabledTooDeeplyNested": "Layouts support a maximum of two levels. Select a content block instead."
  },
  "de": {
    "disabledNotCompatibleWithLayouts": "This block can't be placed inside a layout.",
    "disabledOneInstancePerPage": "You can only have 1 instance of this block type on a page.",
    "disabledTooDeeplyNested": "Layouts support a maximum of two levels. Select a content block instead."
  }
}
</i18n>
