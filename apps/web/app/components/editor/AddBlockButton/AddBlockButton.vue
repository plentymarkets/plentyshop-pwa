<template>
  <button
    v-if="showButton"
    :key="position === 'bottom' ? (isDragging ? 'dragging' : 'not-dragging') : undefined"
    :class="[
      addBlockButtonBase,
      position === 'top'
        ? 'top-0 -translate-y-1/2 group-hover/block:opacity-100 group-hover/block:scale-100 focus-visible:opacity-100 focus-visible:scale-100'
        : 'bottom-0 translate-y-1/2 group-hover/block:opacity-100 group-hover/block:scale-100',
      {
        '!opacity-100 !scale-100':
          (props.isClicked && props.clickedBlockIndex === props.index) ||
          (isPopoverTarget && popoverState?.position === position),
      },
    ]"
    :data-testid="`${position}-add-block`"
    :aria-label="`${position} add block`"
    @click.stop="addNewBlock(props.block, position, $event)"
  >
    <SfTooltip class="flex" :label="buttonLabel" :placement="position" :show-arrow="true">
      <SfIconAdd class="cursor-pointer" size="xs" />
    </SfTooltip>
  </button>
</template>

<script lang="ts" setup>
import { SfIconAdd, SfTooltip } from '@storefront-ui/vue';
import type { Block } from '@plentymarkets/shop-api';
import type { BlockPosition } from '~/composables/useBlockManager/types';

const props = defineProps<{
  block: Block;
  index: number;
  isClicked: boolean;
  clickedBlockIndex: number | null;
  root: boolean;
  enableActions: boolean;
  position: 'top' | 'bottom';
}>();

const viewport = useViewport();
const { isInEditorClient } = useEditorState();
const { isDragging } = useBlockManager();
const { openAddBlockPopover, popoverState } = useAddBlockPopover();
const { logContentCreateBlock } = useLogEvent();

const clientPreview = computed(() => isInEditorClient.value && viewport.isGreaterOrEquals('lg'));

const buttonLabel = 'Insert a new block at this position.';

const addBlockButtonBase = [
  'add-block-button no-drag',
  'absolute left-1/2 -translate-x-1/2 z-base @md:z-raised @lg:z-editor-inline',
  'flex items-center justify-center w-7 h-7 rounded-full p-0 border-0',
  'bg-editor-block-selected text-white shadow-add-block-btn',
  'opacity-0 scale-90',
  'transition-[opacity,transform,box-shadow,background-color] duration-200 ease-editor-out',
  'hover:bg-editor-block-selected-hover hover:scale-110 hover:shadow-add-block-btn-hover',
].join(' ');

const isPopoverTarget = computed(
  () => clientPreview.value && props.enableActions && popoverState.value?.targetUuid === props.block.meta.uuid,
);

const showButton = computed(() => {
  if (!props.enableActions || !clientPreview.value || !props.root || isDragging.value) return false;
  return props.position === 'top' ? !isHeaderContainerBlock(props.block) : !isFooterContainerBlock(props.block);
});

const addNewBlock = (block: Block, position: BlockPosition, event: MouseEvent) => {
  if (useRuntimeConfig().public.enableAddBlockPopover) {
    openAddBlockPopover({ anchorEl: event.currentTarget as HTMLElement, targetUuid: block.meta.uuid, position });
  } else {
    const { openDrawerWithView } = useSiteConfiguration();
    const { togglePlaceholder } = useBlockManager();
    const { clearInsertColumnUuid } = useBlocksMutations();
    togglePlaceholder(block.meta.uuid, position);
    openDrawerWithView('blocksList');
    clearInsertColumnUuid();
  }
  logContentCreateBlock();
};
</script>
