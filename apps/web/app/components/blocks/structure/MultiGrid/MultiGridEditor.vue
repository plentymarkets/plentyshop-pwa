<template>
  <div>
    <div class="flex pb-1 px-px select-none">
      <div v-for="i in 12" :key="i" class="flex-1 text-center text-4xs text-editor-text-dim leading-none">
        {{ i }}
      </div>
    </div>

    <div
      ref="containerRef"
      class="border border-editor-canvas-border rounded-lg overflow-hidden bg-white relative select-none"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @lostpointercapture="onPointerUp"
    >
      <div class="absolute inset-0 flex pointer-events-none z-0">
        <div
          v-for="i in 12"
          :key="i"
          class="flex-1"
          :class="i > 1 ? 'border-l border-dashed border-editor-canvas-border' : ''"
        />
      </div>

      <div class="relative z-[1]">
        <div
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          class="flex h-[50px] border-b border-editor-canvas-border last:border-b-0"
        >
          <div
            v-for="cell in row.cells"
            :key="cell.colIndex"
            :style="{ flex: cell.span }"
            class="relative box-border border-r border-editor-canvas-cell p-1"
          >
            <div
              class="w-full h-full rounded-md flex items-center px-2 overflow-hidden"
              :class="[
                cell.hasContent
                  ? 'bg-editor-accent/10 border border-editor-accent/25'
                  : 'border border-dashed border-editor-cell-border cursor-pointer hover:border-editor-accent hover:bg-editor-accent/[4%]',
              ]"
              @click.stop="!cell.hasContent && onClickCell($event, cell.colIndex)"
            >
              <div class="flex-1 overflow-hidden min-w-0">
                <div
                  v-if="cell.span >= 3"
                  class="text-2xs font-semibold truncate"
                  :class="cell.hasContent ? 'text-editor-accent' : 'text-editor-cell-empty-text'"
                >
                  {{ cell.hasContent ? getEditorTranslation('filled') : getEditorTranslation('empty') }}
                </div>
                <div class="text-3xs" :class="cell.hasContent ? 'text-editor-accent/60' : 'text-editor-cell-empty-sub'">
                  {{ cell.span }}/12
                </div>
              </div>
            </div>

            <div
              class="absolute right-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-col-resize z-[5]"
              @pointerdown.prevent.stop="startDrag($event, cell.colIndex, cell.span)"
              @click.stop
            >
              <div
                class="w-[3px] h-[22px] rounded-sm transition-colors"
                :class="cell.hasContent ? 'bg-editor-accent/35' : 'bg-editor-cell-handle'"
              />
            </div>
          </div>

          <div
            v-if="row.free > 0"
            :style="{ flex: row.free }"
            class="p-[7px_5px] flex items-stretch cursor-pointer"
            @click="onClickFree($event, row.free)"
          >
            <div
              class="flex-1 border border-dashed border-editor-free-border rounded-md flex items-center justify-center text-editor-text-ghost text-sm transition-all duration-150 hover:border-editor-free-border-hover hover:text-editor-text-faint"
            >
              +
            </div>
          </div>
        </div>

        <div
          class="h-8 flex items-center justify-center gap-1.5 cursor-pointer text-editor-accent text-xs bg-editor-toc-hover font-semibold tracking-[0.01em] border-t border-editor-toc-highlight transition-all duration-150 hover:bg-editor-toc-highlight"
          @click="emit('click-add-row', $event.currentTarget as HTMLElement)"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span>{{ getEditorTranslation('add-row') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';

const props = defineProps<{
  columnWidths: number[];
  blocks: Block[];
}>();

const emit = defineEmits<{
  'update:column-widths': [widths: number[]];
  'click-add-row': [anchorEl: HTMLElement];
  'add-free-column': [span: number, anchorEl: HTMLElement];
}>();

const { openAddBlockPopover } = useAddBlockPopover();

const containerRef = ref<HTMLElement | null>(null);

interface RowCell {
  colIndex: number;
  span: number;
  hasContent: boolean;
}
interface GridRow {
  cells: RowCell[];
  free: number;
}

const rows = computed((): GridRow[] => {
  const filledSlots = new Set(
    props.blocks.filter((block) => block.name !== 'EmptyGridBlock').map((block) => block.parent_slot),
  );

  const result: GridRow[] = [];
  let cells: RowCell[] = [];
  let used = 0;

  props.columnWidths.forEach((span, colIndex) => {
    if (used + span > 12) {
      result.push({ cells, free: 12 - used });
      cells = [];
      used = 0;
    }
    cells.push({ colIndex, span, hasContent: filledSlots.has(colIndex) });
    used += span;
  });
  if (cells.length > 0) result.push({ cells, free: 12 - used });
  return result;
});

const onClickCell = (event: MouseEvent, colIndex: number) => {
  const emptyBlock = props.blocks.find((block) => block.parent_slot === colIndex && block.name === 'EmptyGridBlock');
  if (!emptyBlock) return;
  openAddBlockPopover({
    anchorEl: event.currentTarget as HTMLElement,
    targetUuid: emptyBlock.meta.uuid,
    position: 'inside',
  });
};

const onClickFree = (event: MouseEvent, span: number) => {
  emit('add-free-column', span, event.currentTarget as HTMLElement);
};

interface DragState {
  colIndex: number;
  startX: number;
  startSpan: number;
  unitW: number;
}
const dragRef = ref<DragState | null>(null);

const startDrag = (event: PointerEvent, colIndex: number, span: number) => {
  if (!containerRef.value) return;
  const { width } = containerRef.value.getBoundingClientRect();
  dragRef.value = { colIndex, startX: event.clientX, startSpan: span, unitW: width / 12 };
  (event.currentTarget as Element).setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (!dragRef.value) return;
  const { colIndex, startX, startSpan, unitW } = dragRef.value;
  const newSpan = Math.max(1, Math.min(12, startSpan + Math.round((event.clientX - startX) / unitW)));
  if (newSpan !== props.columnWidths[colIndex]) {
    const updated = [...props.columnWidths];
    updated[colIndex] = newSpan;
    emit('update:column-widths', updated);
  }
};

const onPointerUp = () => {
  dragRef.value = null;
};
</script>

<i18n lang="json">
{
  "en": {
    "filled": "Filled",
    "empty": "+ Empty",
    "add-row": "Add Row",
    "choose-layout": "Choose Layout"
  },
  "de": {
    "filled": "Filled",
    "empty": "+ Empty",
    "add-row": "Add Row",
    "choose-layout": "Choose Layout"
  }
}
</i18n>
