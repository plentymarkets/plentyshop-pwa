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
        <AddBlockPopoverBody />
      </div>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import type { PopoverPosition } from './types';

const { popoverState, closeAddBlockPopover } = useAddBlockPopover();
const { initBlocks, resetState } = useAddBlockPopoverPanel();

const panelRef = ref<HTMLElement | null>(null);
const computedPos = ref<PopoverPosition>({
  left: 0,
  top: 0,
  opacity: 0,
  arrowLeft: 0,
  arrowTop: 0,
  arrowDir: 'down',
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
    computedPos.value = { left: 0, top: 0, opacity: 0, arrowLeft: 0, arrowTop: 0, arrowDir: 'down' };
    return;
  }
  await nextTick();
  if (!panelRef.value) return;

  const { width: W, height: H } = panelRef.value.getBoundingClientRect();
  const margin = 8;
  const { anchorCenterX, anchorTop, anchorBottom } = state;

  const left = Math.max(margin, Math.min(anchorCenterX - W / 2, window.innerWidth - W - margin));

  let top = anchorBottom + 12;
  let arrowDir: 'up' | 'down' = 'up';
  if (top + H + margin > window.innerHeight) {
    top = anchorTop - H - 12;
    arrowDir = 'down';
    if (top < margin) {
      top = Math.max(margin, window.innerHeight - H - margin);
      arrowDir = 'up';
    }
  }

  const arrowLeft = Math.max(left + 12, Math.min(anchorCenterX, left + W - 12));
  const arrowTop = arrowDir === 'down' ? top + H - 7 : top - 7;

  computedPos.value = { left, top, opacity: 1, arrowLeft, arrowTop, arrowDir };
};

watch(
  () => popoverState.value,
  (state) => {
    if (state) resetState();
    recalcPosition(state);
  },
);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeAddBlockPopover();
};

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown);
  await initBlocks();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
