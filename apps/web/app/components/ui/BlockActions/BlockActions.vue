<template>
  <div
    :class="[
      'absolute',
      'z-[0]',
      'md:z-[1]',
      'lg:z-[40]',
      'space-x-3',
      'p-2',
      'shadow-md',
      ...(props.actions?.classes || []),
      ...(props.actions?.buttonClasses || []),
    ]"
    data-testid="edit-block-actions"
    :style="{ top: props.actions.position }"
  >
    <SfTooltip
      v-if="!props.actions.isEditable"
      label="You can only edit the footer on the homepage"
      placement="left"
      class="flex"
    >
      <button
        class="text-black hover:bg-gray-100 rounded no-drag p-1"
        data-testid="open-editor-button"
        aria-label="editor button"
        :disabled="!props.actions.isEditable"
        :class="{ 'opacity-40 cursor-not-allowed': !props.actions.isEditable }"
        @click.stop="triggerEdit"
      >
        <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="editPath" fill="black" />
          </svg>
        </SfIconBase>
      </button>
    </SfTooltip>
    <SfTooltip v-else :label="editLabel" placement="left" :show-arrow="true">
      <button
        :class="['text-black', 'p-1', 'rounded', 'no-drag', ...(props.actions?.hoverBackground || [])]"
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
    </SfTooltip>

    <div v-if="props.actions.isMovable" class="w-px h-4 bg-gray-300" />

    <div class="flex flex-col">
      <SfTooltip v-if="props.actions.isMovable" :label="positionLabel" placement="left" :show-arrow="true">
        <button
          class="flex items-center justify-center h-[18px] text-black hover:bg-gray-100 rounded no-drag"
          data-testid="move-up-button"
          aria-label="move up button"
          :disabled="props.index === 0"
          :class="{ 'opacity-40 cursor-not-allowed': props.index === 0 }"
          @click="changePosition(-1)"
        >
          <SfIconExpandLess />
        </button>
      </SfTooltip>
      <SfTooltip v-if="props.actions.isMovable" :label="positionLabel" placement="bottom" :show-arrow="true">
        <button
          class="flex items-center justify-center h-[18px] text-black hover:bg-gray-100 rounded no-drag"
          data-testid="move-down-button"
          aria-label="move down button"
          :disabled="isLastNonFooterBlock(index)"
          :class="{ 'opacity-40 cursor-not-allowed': isLastNonFooterBlock(index) }"
          @click="changePosition(1)"
        >
          <SfIconExpandMore />
        </button>
      </SfTooltip>
    </div>

    <div v-if="props.actions.isMovable" class="w-px h-4 bg-gray-300" />

    <SfTooltip v-if="props.actions.isMovable" :label="positionLabel" placement="bottom" :show-arrow="true">
      <button
        class="drag-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full drag-trigger"
        aria-label="Drag to reorder block"
      >
        <NuxtImg width="18" height="18" :src="dragIcon" />
      </button>
    </SfTooltip>

    <div v-if="props.actions.isDeletable" class="w-px h-4 bg-gray-300" />

    <SfTooltip v-if="props.actions.isDeletable" :label="deleteLabel" placement="bottom" :show-arrow="true">
      <button
        class="text-black hover:bg-gray-100 p-1 rounded no-drag"
        aria-label="delete block button"
        data-testid="delete-block-button"
        @click="triggerDelete"
      >
        <SfIconDelete />
      </button>
    </SfTooltip>
  </div>
</template>

<script lang="ts" setup>
import dragIcon from '~/assets/icons/paths/drag.svg';
import { SfIconDelete, SfIconExpandLess, SfIconExpandMore, SfIconBase, SfTooltip } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';
import type { BlockActionsProps } from '~/components/ui/BlockActions/types';
const editLabel = 'Click to edit this block.';
const positionLabel = 'Change block position.';
const deleteLabel = 'Delete this block.';

const props = withDefaults(defineProps<BlockActionsProps>(), {
  actions: () => ({
    isEditable: true,
    isMovable: true,
    isDeletable: true,
    classes: ['flex', 'items-center', 'right-0', 'top-0', 'border', 'border-[#538AEA]', 'bg-white'],
    buttonClasses: [],
    hoverBackground: ['hover:bg-gray-100'],
    position: '',
  }),
});
const emit = defineEmits(['edit', 'delete', 'change-position']);
const { openDrawerWithView } = useSiteConfiguration();
const { deleteBlock, isLastNonFooterBlock } = useBlockManager();

const triggerEdit = () => {
  openDrawerWithView('blocksSettings', props.block);
};

const triggerDelete = () => {
  deleteBlock(props.block.meta.uuid);
};

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
