<template>
  <div>
    <div class="flex pb-1 px-px select-none">
      <div
        v-for="i in 12"
        :key="i"
        class="flex-1 text-center text-[9px] text-[#c8c8c8] leading-none"
      >
        {{ i }}
      </div>
    </div>

    <div
      ref="containerRef"
      class="border border-[#e2e2e2] rounded-lg overflow-hidden bg-white relative select-none"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <div class="absolute inset-0 flex pointer-events-none z-0">
        <div
          v-for="i in 12"
          :key="i"
          class="flex-1"
          :class="i > 1 ? 'border-l border-dashed border-[#ededed]' : ''"
        />
      </div>

      <div class="relative z-[1]">
        <div
          v-for="(row, rIdx) in rows"
          :key="rIdx"
          class="flex h-[50px] border-b border-[#eeeeee] last:border-b-0"
        >

          <div
            v-for="cell in row.cells"
            :key="cell.colIndex"
            :style="{ flex: cell.span }"
            class="relative box-border border-r border-[#f3f3f3] p-1"
          >
            <div
              class="w-full h-full rounded-[5px] flex items-center px-2 overflow-hidden"
              :class="[
                cell.hasContent
                  ? 'bg-[rgba(29,94,199,0.1)] border border-[rgba(29,94,199,0.25)]'
                  : 'border border-dashed border-[#c8cdd4] cursor-pointer hover:border-[#1D5EC7] hover:bg-[rgba(29,94,199,0.04)]',
              ]"
              @click.stop="!cell.hasContent && onClickCell($event, cell.colIndex)"
            >
              <div class="flex-1 overflow-hidden min-w-0">
                <div
                  v-if="cell.span >= 3"
                  class="text-[11px] font-semibold truncate"
                  :class="cell.hasContent ? 'text-[#1D5EC7]' : 'text-[#9aa3ad]'"
                >
                  {{ cell.hasContent ? getEditorTranslation('filled') : getEditorTranslation('empty') }}
                </div>
                <div
                  class="text-[10px]"
                  :class="cell.hasContent ? 'text-[rgba(29,94,199,0.6)]' : 'text-[#bcc2c9]'"
                >
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
                class="w-[3px] h-[22px] rounded-[2px] transition-colors"
                :class="cell.hasContent ? 'bg-[rgba(29,94,199,0.35)]' : 'bg-[#dadde2]'"
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
              class="flex-1 border border-dashed border-[#d4d4d4] rounded-[5px] flex items-center justify-center text-[#bbb] text-sm transition-all duration-[120ms] hover:border-[#999] hover:text-[#888]"
            >
              +
            </div>
          </div>
        </div>

        <div
          class="h-8 flex items-center justify-center gap-[5px] cursor-pointer text-[#1D5EC7] text-[12px] bg-[#f4f8ff] font-semibold tracking-[0.01em] border-t border-[#e3ecfd] transition-all duration-[120ms] hover:bg-[#e8f0ff]"
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
  const result: GridRow[] = [];
  let cells: RowCell[] = [];
  let used = 0;

  props.columnWidths.forEach((span, colIndex) => {
    if (used + span > 12) {
      result.push({ cells, free: 12 - used });
      cells = [];
      used = 0;
    }
    const hasContent = props.blocks.some(
      (b) => b.parent_slot === colIndex && b.name !== 'EmptyGridBlock',
    );
    cells.push({ colIndex, span, hasContent });
    used += span;
  });
  if (cells.length > 0) result.push({ cells, free: 12 - used });
  return result;
});

const onClickCell = (event: MouseEvent, colIndex: number) => {
  const emptyBlock = props.blocks.find(
    (b) => b.parent_slot === colIndex && b.name === 'EmptyGridBlock',
  );
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

const startDrag = (e: PointerEvent, colIndex: number, span: number) => {
  if (!containerRef.value) return;
  const { width } = containerRef.value.getBoundingClientRect();
  dragRef.value = { colIndex, startX: e.clientX, startSpan: span, unitW: width / 12 };
  (e.currentTarget as Element).setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!dragRef.value) return;
  const { colIndex, startX, startSpan, unitW } = dragRef.value;
  const newSpan = Math.max(1, Math.min(12, startSpan + Math.round((e.clientX - startX) / unitW)));
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
