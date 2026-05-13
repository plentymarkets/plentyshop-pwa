<template>
  <Teleport to="body">
    <template v-if="popoverState">
      <div class="fixed inset-0 z-[200]" @click="closeAddBlockPopover" />

      <AddBlockPopoverArrow :position="popoverPosition" />

      <div
        ref="panelRef"
        class="fixed z-[201] w-[296px] max-h-[350px] bg-white rounded-xl border border-editor-border flex flex-col overflow-hidden"
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
import {
  VIEWPORT_EDGE_MARGIN,
  clampHorizontal,
  placeBelow,
  placeAbove,
  fitsBelow,
  fitsAbove,
  clampArrowHorizontal,
  arrowVerticalPosition,
} from './positioning';

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

  let top = placeBelow(anchorBottom);
  let arrowDirection: 'up' | 'down' = 'up';

  if (!fitsBelow(top, height)) {
    top = placeAbove(anchorTop, height);
    arrowDirection = 'down';
    if (!fitsAbove(top)) {
      top = Math.max(VIEWPORT_EDGE_MARGIN, window.innerHeight - height - VIEWPORT_EDGE_MARGIN);
      arrowDirection = 'up';
    }
  }

  const arrowLeft = clampArrowHorizontal(left, anchorCenterX, width);
  const arrowTop = arrowVerticalPosition(arrowDirection, top, height);
  popoverPosition.value = { left, top, opacity: 1, arrowLeft, arrowTop, arrowDirection };
};

watch(() => popoverState.value, recalcPosition);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeAddBlockPopover();
};

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown);
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
});
</script>
