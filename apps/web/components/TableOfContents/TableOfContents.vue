<template>
  <div 
    data-testid="tableofcontents"
    class="p-4 h-full bg-neutral-50"
  >
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-neutral-200">
      <h2 class="text-lg font-semibold text-neutral-900">
        {{ t('tableOfContents.title') }}
      </h2>
      <UiButton
        variant="tertiary"
        square
        :aria-label="t('tableOfContents.close')"
        @click="handleClose"
      >
        <SfIconClose class="text-neutral-500" />
      </UiButton>
    </div>

    <!-- Content -->
    <div class="mt-4">
      <p v-if="!blocksList.length" class="text-neutral-500 text-sm">
        {{ t('tableOfContents.noBlocks') }}
      </p>
      
            <div v-if="blocksList.length" class="space-y-0">
        <!-- List items with insertion indicators before each top-level block -->
        <template v-for="(block, index) in blocksList" :key="block.uuid">
          <!-- Insertion indicator before this block - only for top-level blocks -->
          <div v-if="block.depth === 0" class="group/insert relative py-1 mx-2 opacity-0 hover:opacity-100 transition-opacity duration-150">
            <div class="h-px bg-gray-200 w-full" />
            <button
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full 
                     opacity-0 group-hover/insert:opacity-100 transition-opacity duration-150
                     flex items-center justify-center text-white text-xs font-semibold
                     border-2 border-white shadow-sm"
              :title="t('tableOfContents.addBlockBefore', { blockName: block.name })"
              @click="handleAddBlock(block.uuid, 'top')"
            >
              +
            </button>
          </div>

          <!-- Block item -->
          <div
            class="group p-2 rounded-md cursor-pointer transition-colors hover:bg-neutral-100"
            :class="{ 'bg-neutral-100': block.uuid === currentBlockUuid }"
            :style="{ paddingLeft: `${block.depth * 16 + 8}px` }"
            @click="handleBlockClick(block)"
          >
            <!-- Block content -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 min-w-0 flex-1">
                <div
                  class="w-2 h-2 rounded-full flex-shrink-0"
                  :class="block.type === 'structure' ? 'bg-blue-500' : 'bg-green-500'"
                />
                <span class="text-sm font-medium text-neutral-900 truncate" :class="{ 'text-neutral-400 italic': isBlockEmpty(block.uuid) }">{{ getBlockDisplayName(block) }}</span>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                  <button
                    class="p-1 rounded hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900"
                    :aria-label="t('tableOfContents.scrollToBlock', { blockName: block.name })"
                    @click.stop="handleScrollToBlock(block)"
                  >
                    <SfIconLocationOnFilled size="sm" />
                  </button>
                  <button
                    v-if="!isBlockEmpty(block.uuid)"
                    class="p-1 rounded hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900"
                    :aria-label="t('tableOfContents.editBlock', { blockName: block.name })"
                    @click.stop="handleEditBlock(block)"
                  >
                    <SfIconBase size="sm" viewBox="0 0 18 18">
                      <path :d="editPath" fill="currentColor" />
                    </SfIconBase>
                  </button>
                </div>
                <span class="text-xs text-neutral-400">{{ index + 1 }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-6 pt-4 border-t border-neutral-200">
      <p class="text-xs font-medium text-neutral-600 mb-2">
        {{ t('tableOfContents.legend') }}
      </p>
      <div class="flex items-center space-x-4 text-xs text-neutral-500">
        <div class="flex items-center space-x-1">
          <div class="w-2 h-2 rounded-full bg-blue-500" />
          <span>{{ t('tableOfContents.structure') }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-2 h-2 rounded-full bg-green-500" />
          <span>{{ t('tableOfContents.content') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconBase, SfIconLocationOnFilled } from '@storefront-ui/vue';
import type { TableOfContentsProps, BlockListItem } from './types';
import type { Block } from '@plentymarkets/shop-api';
import { editPath } from 'assets/icons/paths/edit';

defineProps<TableOfContentsProps>();

const { t } = useI18n();
const { data } = useCategoryTemplate();
const { currentBlockUuid, findOrDeleteBlockByUuid, togglePlaceholder, multigridColumnUuid, blockHasData } = useBlockManager();
const { closeDrawer, openDrawerWithView } = useSiteConfiguration();

// Convert blocks to flat list with depth information
const blocksList = computed<BlockListItem[]>(() => {
  if (!data.value || !Array.isArray(data.value)) return [];
  
  const flattenBlocks = (blocks: Block[], depth = 0): BlockListItem[] => {
    const result: BlockListItem[] = [];
    
    for (const block of blocks) {
      result.push({
        name: block.name,
        uuid: block.meta.uuid,
        type: block.type as 'structure' | 'content',
        depth,
      });
      
      // Recursively add nested blocks (for structure blocks like MultiGrid)
      if (Array.isArray(block.content) && block.content.length > 0) {
        result.push(...flattenBlocks(block.content, depth + 1));
      }
    }
    
    return result;
  };
  
  return flattenBlocks(data.value);
});

// Helper to check if a block is empty
const isBlockEmpty = (blockUuid: string): boolean => {
  const fullBlock = findOrDeleteBlockByUuid(data.value, blockUuid);
  return fullBlock ? !blockHasData(fullBlock) : false;
};

// Helper to get display name for block
const getBlockDisplayName = (block: BlockListItem): string => {
  return isBlockEmpty(block.uuid) ? t('tableOfContents.addBlock') : block.name;
};

const handleClose = () => {
  closeDrawer();
};

const handleBlockClick = (block: BlockListItem) => {
  // If block is empty, handle as add block action
  if (isBlockEmpty(block.uuid)) {
    handleAddBlock(block.uuid, 'inside');
  }
  // For now, just highlight the block selection for non-empty blocks
  // Actual scrolling is handled by the dedicated scroll button
};

const handleScrollToBlock = (block: BlockListItem) => {
  // Scroll to the block in the editor
  const element = document.querySelector(`[data-uuid="${block.uuid}"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Optional: Highlight the block briefly
  element?.classList.add('ring-2', 'ring-blue-500');
  setTimeout(() => {
    element?.classList.remove('ring-2', 'ring-blue-500');
  }, 1000);
};

const handleEditBlock = (block: BlockListItem) => {
  // Find the full block object from the data using the existing function
  const fullBlock = findOrDeleteBlockByUuid(data.value, block.uuid);
  if (fullBlock) {
    // Open the block settings drawer
    openDrawerWithView('blocksSettings', fullBlock);
  }
};

const handleAddBlock = (targetUuid: string, position: 'top' | 'bottom' | 'inside') => {
  // Set the placeholder to show where the block will be inserted
  togglePlaceholder(targetUuid, position);
  // Open the blocks selection drawer
  openDrawerWithView('blocksList');
  // Clear multigrid state (required for proper block insertion)
  multigridColumnUuid.value = null;
};
</script>

<i18n lang="json">
{
  "en": {
    "tableOfContents": {
      "title": "Table of Contents",
      "close": "Close",
      "noBlocks": "No blocks found on this page",
      "legend": "Legend:",
      "structure": "Structure",
      "content": "Content",
      "addBlock": "Add block",
      "editBlock": "Edit {blockName} block",
      "scrollToBlock": "Scroll to {blockName} block",
      "addBlockBefore": "Add new block before {blockName}",
      "addBlockAfter": "Add new block after {blockName}"
    }
  },
  "de": {
    "tableOfContents": {
      "title": "Inhaltsverzeichnis",
      "close": "Schließen",
      "noBlocks": "Keine Blöcke auf dieser Seite gefunden",
      "legend": "Legende:",
      "structure": "Struktur",
      "content": "Inhalt",
      "addBlock": "Block hinzufügen",
      "editBlock": "{blockName}-Block bearbeiten",
      "scrollToBlock": "Zu {blockName}-Block scrollen",
      "addBlockBefore": "Neuen Block vor {blockName} hinzufügen",
      "addBlockAfter": "Neuen Block nach {blockName} hinzufügen"
    }
  }
}
</i18n>
