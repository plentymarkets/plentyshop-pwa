<template>
  <div
    class="absolute z-[0] md:z-[1] lg:z-[9] right-0 top-0 flex items-center space-x-4 border border-[#538AEA] bg-white p-2 shadow-md"
    data-testid="edit-block-actions"
  >
    <button
      class="text-black hover:bg-gray-100 p-1 rounded no-drag"
      data-testid="open-editor-button"
      aria-label="editor button"
      @click.stop="triggerEdit"
    >
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="editPath" fill="black" />
        </svg>
      </SfIconBase>
    </button>

    <div class="w-px h-4 bg-gray-300" />

    <button
      class="drag-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full drag-trigger"
      aria-label="Drag to reorder block"
    >
      <SfIconUnfoldMore />
    </button>

    <div class="w-px h-4 bg-gray-300" />

    <button
      class="text-black hover:bg-gray-100 p-1 rounded no-drag"
      aria-label="delete block button"
      data-testid="delete-block-button"
      @click="triggerDelete"
    >
      <SfIconDelete />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { SfIconDelete, SfIconUnfoldMore, SfIconBase } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';
import type { Block } from '@plentymarkets/shop-api';

const props = defineProps<{ index: number; block: Block }>();

defineEmits(['edit', 'delete', 'change-position']);

const { openDrawerWithView } = useSiteConfiguration();
const { deleteBlock } = useBlockManager();

const triggerEdit = () => {
  openDrawerWithView('blocksSettings', props.block);
};

const triggerDelete = () => {
  deleteBlock(props.block.meta.uuid);
};
</script>
