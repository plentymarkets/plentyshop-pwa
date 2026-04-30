<template>
  <div>
    <!-- Column Ruler -->
    <div class="flex pb-1 px-px">
      <div
        v-for="i in COLS"
        :key="i"
        class="flex-1 text-center text-[9px] text-[#c8c8c8] leading-none select-none"
      >
        {{ i }}
      </div>
    </div>

    <!-- Grid Area -->
    <div
      ref="containerRef"
      class="border border-[#e2e2e2] rounded-lg overflow-hidden bg-white relative select-none"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <!-- Dashed column guides -->
      <div class="absolute inset-0 flex pointer-events-none z-0">
        <div
          v-for="i in COLS"
          :key="i"
          class="flex-1"
          :class="i > 1 ? 'border-l border-dashed border-[#ededed]' : ''"
        />
      </div>

      <div class="relative z-[1]">
        <!-- Rows -->
        <div
          v-for="(row, rIdx) in rows"
          :key="rIdx"
          class="flex h-[50px] border-b border-[#eee]"
        >
          <!-- Block cells -->
          <div
            v-for="block in row"
            :key="block.uuid"
            class="flex items-center relative cursor-pointer overflow-hidden border-r-2 border-white/25 transition-colors duration-100"
            :style="{
              width: `${(block.span / COLS) * 100}%`,
              background: block.uuid === selectedId ? block.color : block.color + 'b0',
              outline: block.uuid === selectedId ? `2px solid ${block.color}` : 'none',
              outlineOffset: '-2px',
            }"
            @click.stop="emit('select', block.uuid)"
          >
            <div class="flex-1 overflow-hidden min-w-0 px-2.5">
              <div
                v-if="block.span >= 3"
                class="text-[11px] text-white/95 font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {{ block.label }}
              </div>
              <div class="text-[10px] text-white/70" :class="block.span >= 3 ? 'mt-px' : ''">
                {{ block.span }}/{{ COLS }}
              </div>
            </div>

            <!-- Delete button (when selected) -->
            <button
              v-if="block.uuid === selectedId"
              type="button"
              class="w-[18px] h-[18px] rounded-full bg-black/20 border-none text-white/90 text-[13px] leading-[18px] cursor-pointer flex-shrink-0 flex items-center justify-center mr-1.5 p-0"
              @click.stop="emit('delete', block.uuid)"
            >
              &times;
            </button>

            <!-- Resize handle -->
            <div
              class="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-[5] flex items-center justify-center"
              @pointerdown.prevent.stop="startResize($event, block.uuid, block.span)"
              @click.stop
            >
              <div
                class="w-[3px] h-[22px] rounded-sm"
                :class="
                  block.uuid === selectedId
                    ? 'bg-white/85 shadow-[0_0_4px_rgba(0,0,0,0.15)]'
                    : 'bg-white/40'
                "
              />
            </div>
          </div>

          <div
            v-if="rowEmpty(row) > 0"
            class="flex items-stretch"
            :style="{ width: `${(rowEmpty(row) / COLS) * 100}%`, padding: '7px 5px' }"
            @click="emit('addInRow', rowEmpty(row))"
          >
            <div
              class="flex-1 border-[1.5px] border-dashed border-[#d4d4d4] rounded-[5px] flex items-center justify-center cursor-pointer text-[#bbb] text-sm font-normal transition-all duration-100 hover:border-[#999] hover:text-[#888]"
            >
              +
            </div>
          </div>
        </div>

        <!-- Add row button -->
        <div
          class="h-8 flex items-center justify-center gap-[5px] cursor-pointer text-[#999] text-xs bg-[#f8f8f8] font-medium tracking-[0.01em] transition-all duration-100 hover:text-[#555] hover:bg-[#f2f2f2]"
          @click="emit('addRow')"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span>Add Column</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface GridBlock {
  uuid: string;
  label: string;
  span: number;
  color: string;
}

const props = defineProps<{
  blocks: GridBlock[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [uuid: string];
  resize: [uuid: string, span: number];
  delete: [uuid: string];
  addInRow: [remainingSpan: number];
  addRow: [];
}>();

const COLS = 12;
const containerRef = ref<HTMLDivElement | null>(null);
const dragState = ref<{ uuid: string; startX: number; startSpan: number; unitW: number } | null>(null);

const rows = computed(() => {
  const result: GridBlock[][] = [];
  let row: GridBlock[] = [];
  let used = 0;

  for (const b of props.blocks) {
    if (used + b.span > COLS) {
      if (row.length) result.push([...row]);
      row = [b];
      used = b.span;
    } else {
      row.push(b);
      used += b.span;
    }
  }
  if (row.length) result.push(row);
  return result;
});

const rowEmpty = (row: GridBlock[]) => COLS - row.reduce((a, b) => a + b.span, 0);

const startResize = (e: PointerEvent, uuid: string, span: number) => {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  dragState.value = { uuid, startX: e.clientX, startSpan: span, unitW: rect.width / COLS };
  (e.target as HTMLElement).setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!dragState.value) return;
  const { uuid, startX, startSpan, unitW } = dragState.value;
  const newSpan = Math.max(1, Math.min(COLS, startSpan + Math.round((e.clientX - startX) / unitW)));
  emit('resize', uuid, newSpan);
};

const onPointerUp = () => {
  dragState.value = null;
};
</script>
