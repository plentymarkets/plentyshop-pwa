<template>
  <div class="relative w-full flex flex-col items-center">
    <input v-model.number="splitIndex" type="range" min="1" max="11" step="1" class="sr-only" @input="onInput" />
    <div
      ref="squaresContainer"
      class="flex w-full mt-2 mb-4 rounded overflow-hidden border border-gray-300 relative"
      style="height: 24px"
      @mousedown="handlePointerDown"
    >
      <div
        v-for="step in steps"
        :key="step"
        class="flex-1 h-full cursor-pointer border-r last:border-r-0 border-gray-300 bg-white"
        :class="{
          'border-r-[1.5px] border-r-primary-500': step === splitIndex,
          'border-l-[1.5px] border-l-primary-500': step === splitIndex + 1,
        }"
        @click="updateSplitFromEvent"
      />
    </div>
    <div class="absolute" :style="arrowStyle" style="top: 32px">
      <span class="text-editor-button text-lg cursor-pointer select-none" @mousedown="handlePointerDown">&#9650;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';

const { multiGridStructure } = defineProps<{ multiGridStructure: ColumnBlock }>();
const emit = defineEmits<{
  (e: 'update:columnWidths', value: number[]): void;
}>();

const steps = Array.from({ length: 12 }, (_, i) => i + 1);
const splits = Array.from({ length: 11 }, (_, i) => i + 1);

const squaresContainer = ref<HTMLElement | null>(null);
const isDragging = ref(false);

const splitIndex = computed({
  get: () => multiGridStructure.configuration?.columnWidths?.[0] || 6,
  set: (val: number) => {
    const columns = multiGridStructure.configuration.columnWidths.length;
    const firstColWidth = Math.max(1, Math.min(val, 11));
    if (columns === 2) {
      emit('update:columnWidths', [firstColWidth, 12 - firstColWidth]);
    }
  },
});

const onInput = (e: Event) => {
  columnCount.value = Number((e.target as HTMLInputElement).value);
};

const updateSplitFromEvent = (e: MouseEvent) => {
  const container = squaresContainer.value;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const stepWidth = rect.width / steps.length;
  let split = Math.round(x / stepWidth);
  split = Math.max(1, Math.min(split, splits.length));
  splitIndex.value = split;
};

const handlePointerDown = (e: MouseEvent) => {
  isDragging.value = true;
  updateSplitFromEvent(e);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);
};

const handlePointerMove = (e: MouseEvent) => {
  if (isDragging.value) {
    updateSplitFromEvent(e);
  }
};

const handlePointerUp = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', handlePointerMove);
  window.removeEventListener('mouseup', handlePointerUp);
};

const containerWidth = ref(0);
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  setTimeout(() => {
    if (squaresContainer.value) {
      containerWidth.value = squaresContainer.value.offsetWidth;
      resizeObserver = new ResizeObserver(() => {
        containerWidth.value = squaresContainer.value?.offsetWidth || 0;
      });
      resizeObserver.observe(squaresContainer.value);
    }
  }, 50);
});

onBeforeUnmount(() => {
  if (resizeObserver && squaresContainer.value) {
    resizeObserver.unobserve(squaresContainer.value);
    resizeObserver.disconnect();
  }
});

const arrowStyle = computed(() => {
  const width = containerWidth.value;
  const stepWidth = width / steps.length;
  const arrowWidth = 16;
  const left = stepWidth * splitIndex.value - arrowWidth / 2;
  return { left: `${left}px` };
});

const columnCount = computed({
  get: () => multiGridStructure.configuration?.columnWidths?.[0] || 6,
  set: (val: number) => {
    const columns = multiGridStructure.configuration.columnWidths.length;
    const firstColWidth = Math.max(1, Math.min(val, 11));
    if (columns === 2) {
      emit('update:columnWidths', [firstColWidth, 12 - firstColWidth]);
    }
  },
});
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
