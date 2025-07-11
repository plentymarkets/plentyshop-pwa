<template>
  <div
    class="absolute z-[0] md:z-[1] lg:z-[9] right-0 top-0 flex items-center space-x-3 border border-[#538AEA] bg-white p-2 shadow-md"
    data-testid="edit-block-actions"
  >
    <SfTooltip v-if="isEditDisabled" label="You can only edit the footer on the homepage" placement="left" class="flex">
      <button
        class="text-black hover:bg-gray-100 p-1 rounded no-drag"
        data-testid="open-editor-button"
        aria-label="editor button"
        :disabled="isEditDisabled"
        :class="{ 'opacity-40 cursor-not-allowed': isEditDisabled }"
        @click.stop="triggerEdit"
      >
        <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="editPath" fill="black" />
          </svg>
        </SfIconBase>
      </button>
    </SfTooltip>
    <button
      v-else
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

    <div v-if="props.block.name !== 'Footer'" class="w-px h-4 bg-gray-300" />

    <div class="flex flex-col">
      <button
        v-if="props.block.name !== 'Footer'"
        class="flex items-center justify-center h-[18px] text-black hover:bg-gray-100 rounded no-drag"
        data-testid="move-up-button"
        aria-label="move up button"
        :disabled="props.index === 0"
        :class="{ 'opacity-40 cursor-not-allowed': props.index === 0 }"
        @click="changePosition(-1)"
      >
        <SfIconExpandLess />
      </button>

      <button
        v-if="props.block.name !== 'Footer'"
        class="flex items-center justify-center h-[18px] text-black hover:bg-gray-100 rounded no-drag"
        data-testid="move-down-button"
        aria-label="move down button"
        :disabled="isLastNonFooterBlock(index)"
        :class="{ 'opacity-40 cursor-not-allowed': isLastNonFooterBlock(index) }"
        @click="changePosition(1)"
      >
        <SfIconExpandMore />
      </button>
    </div>

    <div v-if="props.block.name !== 'Footer'" class="w-px h-4 bg-gray-300" />

    <button
      v-if="props.block.name !== 'Footer'"
      class="drag-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full drag-trigger"
      aria-label="Drag to reorder block"
    >
      <NuxtImg width="18" height="18" :src="dragIcon" />
    </button>

    <div v-if="props.block.name !== 'Footer'" class="w-px h-4 bg-gray-300" />

    <button
      v-if="props.block.name !== 'Footer'" 
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
import dragIcon from 'assets/icons/paths/drag.svg';
import { SfIconDelete, SfIconExpandLess, SfIconExpandMore, SfIconBase, SfTooltip } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';
import type { Block } from '@plentymarkets/shop-api';

const props = defineProps<{ index: number; block: Block }>();

const emit = defineEmits(['edit', 'delete', 'change-position']);
const route = useRoute();
const { openDrawerWithView } = useSiteConfiguration();
const { deleteBlock, isLastNonFooterBlock } = useBlockManager();

const triggerEdit = () => {
  openDrawerWithView('blocksSettings', props.block);
};

const triggerDelete = () => {
  deleteBlock(props.block.meta.uuid);
};
const isEditDisabled = computed(() => props.block.name === 'Footer' && route.fullPath !== '/');

const scrollToBlock = (newIndex: number) => {
  const block = document.getElementById(`block-${newIndex}`);
  if (block) {
    block.scrollIntoView(true);
    window.scrollBy(0, -200);
  }
};
let timeoutId: ReturnType<typeof setTimeout>;

const changePosition = (position: number) => {
  emit('change-position', props.index, position);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    scrollToBlock(props.index + position);
  }, 100);
};
</script>
