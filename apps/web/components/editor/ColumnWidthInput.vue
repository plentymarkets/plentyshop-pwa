<template>
  <div class="relative w-full flex flex-col items-center">
    <input v-model.number="splitIndex" type="range" min="1" max="11" step="1" class="sr-only" @input="onInput" />
    <div
      ref="squaresContainer"
      class="flex w-full mt-2 mb-4 rounded overflow-hidden border border-gray-300 relative h-[24px]"
      @mousedown="handlePointerDown"
    >
      <div
        v-for="step in steps"
        :key="step"
        class="flex-1 h-full cursor-pointer border-r last:border-r-0 border-gray-300 bg-white flex items-center justify-center"
        :class="getStepBorderClass(step)"
        @click="updateSplitFromEvent"
      >
        <span class="text-sm text-gray-500 select-none">{{ step }}</span>
      </div>
    </div>
    <div class="relative w-full flex justify-start -mt-4" :style="arrowStyle">
      <span class="absolute text-editor-button text-lg cursor-pointer select-none" @mousedown="handlePointerDown"
        >&#9650;</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';

const { multiGridStructure } = defineProps<{ multiGridStructure: ColumnBlock }>();
const columnWidths = computed(() => multiGridStructure.configuration.columnWidths);
const emit = defineEmits<{ (event: 'update:columnWidths', value: number[]): void }>();

const {
  steps,
  squaresContainer,
  splitIndex,
  updateSplitFromEvent,
  handlePointerDown,
  arrowStyle,
  getStepBorderClass,
  onInput,
} = useGridSplits({
  columnWidths,
  emit,
});
</script>
