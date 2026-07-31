<template>
  <Teleport to="body">
    <template v-if="popoverState">
      <div class="fixed inset-0 z-modal-backdrop" @click="closeAddBlockPopover" />

      <AddBlockPopoverArrow :position="popoverPosition" />

      <div
        ref="panelRef"
        data-testid="add-block-popover"
        class="fixed z-modal w-[296px] h-[350px] bg-white rounded-xl border border-editor-border flex flex-col overflow-hidden"
        :style="panelStyle"
        @click.stop
      >
        <AddBlockPopoverHeader />
        <AddBlockPopoverBody :is-loading="isLoading" />
      </div>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import type { PopoverPosition } from './types';
import { clampHorizontal, placeBelow, placeAbove, fitsBelow, fitsAbove, arrowVerticalPosition } from './positioning';

const { popoverState, closeAddBlockPopover } = useAddBlockPopover();
const { blocksLists, getBlocksLists } = useBlocksList();

const panelRef = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const popoverPosition = ref<PopoverPosition>({
  left: 0,
  top: 0,
  opacity: 0,
  arrowLeft: 0,
  arrowTop: 0,
  arrowDirection: 'down',
});

const panelStyle = computed(() => ({
  left: `${popoverPosition.value.left}px`,
  top: `${popoverPosition.value.top}px`,
  opacity: popoverPosition.value.opacity,
  boxShadow: '0 10px 38px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
  transition: 'opacity 0.08s',
}));

const recalcPosition = async (state: typeof popoverState.value) => {
  if (!state) {
    popoverPosition.value = { left: 0, top: 0, opacity: 0, arrowLeft: 0, arrowTop: 0, arrowDirection: 'down' };
    return;
  }
  await nextTick();
  if (!panelRef.value) return;

  const { width, height } = panelRef.value.getBoundingClientRect();
  const { anchorCenterX, anchorTop, anchorBottom } = state;

  const left = clampHorizontal(anchorCenterX, width);

  const spaceAbove = anchorTop;
  const spaceBelow = window.innerHeight - anchorBottom;

  let top: number;
  let arrowDirection: 'up' | 'down';

  if (spaceAbove >= spaceBelow) {
    top = placeAbove(anchorTop, height);
    arrowDirection = 'down';
    if (!fitsAbove(top)) {
      top = placeBelow(anchorBottom);
      arrowDirection = 'up';
    }
  } else {
    top = placeBelow(anchorBottom);
    arrowDirection = 'up';
    if (!fitsBelow(top, height)) {
      top = placeAbove(anchorTop, height);
      arrowDirection = 'down';
    }
  }

  const arrowLeft = anchorCenterX;
  const arrowTop = arrowVerticalPosition(arrowDirection, top, height);
  popoverPosition.value = { left, top, opacity: 1, arrowLeft, arrowTop, arrowDirection };
};

watch(() => popoverState.value, recalcPosition);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeAddBlockPopover();
};

const handleWheel = (event: WheelEvent) => {
  if (!popoverState.value) return;
  if (panelRef.value?.contains(event.target as Node)) return;
  event.preventDefault();
};

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('wheel', handleWheel, { passive: false });
  if (Object.keys(blocksLists.value).length === 0) {
    isLoading.value = true;
    try {
      await getBlocksLists();
    } finally {
      isLoading.value = false;
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('wheel', handleWheel);
});
</script>
