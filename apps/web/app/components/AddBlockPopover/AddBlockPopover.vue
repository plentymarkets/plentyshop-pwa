<template>
  <Teleport to="body">
    <template v-if="popoverState">
      <div class="fixed inset-0 z-[200]" @click="closeAddBlockPopover" />

      <AddBlockPopoverArrow :pos="computedPos" />

      <div
        ref="panelRef"
        class="fixed z-[201] w-[296px] max-h-[350px] bg-white rounded-[10px] border border-[#e8e8e8] flex flex-col overflow-hidden"
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

const { popoverState, closeAddBlockPopover } = useAddBlockPopover();
const { blocksLists, getBlocksLists } = useBlocksList();

const panelRef = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const computedPos = ref<PopoverPosition>({
  left: 0,
  top: 0,
  opacity: 0,
  arrowLeft: 0,
  arrowTop: 0,
  arrowDirection: 'down',
});

const panelStyle = computed(() => ({
  left: `${computedPos.value.left}px`,
  top: `${computedPos.value.top}px`,
  opacity: computedPos.value.opacity,
  boxShadow: '0 10px 38px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
  transition: 'opacity 0.08s',
}));

const recalcPosition = async (state: typeof popoverState.value) => {
  if (!state) {
    computedPos.value = { left: 0, top: 0, opacity: 0, arrowLeft: 0, arrowTop: 0, arrowDirection: 'down' };
    return;
  }
  await nextTick();
  if (!panelRef.value) return;

  const { width, height } = panelRef.value.getBoundingClientRect();
  const margin = 8;
  const { anchorCenterX, anchorTop, anchorBottom } = state;
  const left = Math.max(margin, Math.min(anchorCenterX - width / 2, window.innerWidth - width - margin));

  let top = anchorBottom + 12;
  let arrowDirection: 'up' | 'down' = 'up';
  if (top + height + margin > window.innerHeight) {
    top = anchorTop - height - 12;
    arrowDirection = 'down';
    if (top < margin) {
      top = Math.max(margin, window.innerHeight - height - margin);
      arrowDirection = 'up';
    }
  }

  const arrowLeft = Math.max(left + 12, Math.min(anchorCenterX, left + width - 12));
  const arrowTop = arrowDirection === 'down' ? top + height - 7 : top - 7;
  computedPos.value = { left, top, opacity: 1, arrowLeft, arrowTop, arrowDirection };
};

watch(() => popoverState.value, recalcPosition);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeAddBlockPopover();
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
