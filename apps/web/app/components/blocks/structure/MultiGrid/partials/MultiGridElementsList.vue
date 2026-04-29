<template>
  <div>
    <div ref="listRef">
      <!-- Element rows -->
      <div
        v-for="(block, i) in blocks"
        :key="block.uuid"
        :data-el-item="true"
        :style="{ opacity: dragState?.fromIdx === i ? 0.25 : 1 }"
        class="transition-opacity duration-100"
      >
        <!-- Drop indicator above -->
        <div
          v-if="dragState && dragState.fromIdx !== i && dragState.overIdx === i && dragState.fromIdx > i"
          class="h-[3px] bg-[#1D5EC7] mx-2.5 my-px rounded-sm"
        />

        <!-- Element row -->
        <div
          class="flex items-center py-[7px] px-2.5 pr-[10px] border-b border-[#f2f2f2] select-none cursor-default transition-colors duration-100"
          :class="[
            block.uuid === selectedId ? 'bg-[#eef3ff] outline outline-1 outline-[#d0deff] -outline-offset-1' : '',
          ]"
          @click="$emit('select', block.uuid)"
          @mouseenter="hoveredIdx = i"
          @mouseleave="hoveredIdx = -1"
        >
          <!-- Drag handle -->
          <div
            class="text-xs mr-[7px] cursor-grab flex-shrink-0 px-[3px] leading-none tracking-[0.3px] transition-colors duration-100"
            :class="hoveredIdx === i ? 'text-[#bbb]' : 'text-[#ddd]'"
            @pointerdown.prevent="startDrag($event, i)"
          >
            &#8942;&#8942;
          </div>

          <!-- Color swatch -->
          <div
            class="w-2.5 h-2.5 rounded-[3px] flex-shrink-0 mr-2"
            :style="{ background: block.color }"
          />

          <!-- Label -->
          <span
            class="flex-1 text-[13px] text-[#1a1a1a] overflow-hidden text-ellipsis whitespace-nowrap"
            :class="block.uuid === selectedId ? 'font-medium' : ''"
          >
            {{ block.label }}
          </span>

          <!-- Span badge -->
          <span
            class="text-[10px] font-bold py-[2px] px-[5px] rounded-[3px] flex-shrink-0 ml-1.5"
            :style="{ color: block.color, background: block.color + '1e' }"
          >
            {{ block.span }}/12
          </span>

          <!-- Type (on hover/selected) -->
          <span
            v-if="hoveredIdx === i || block.uuid === selectedId"
            class="text-[9px] text-[#bbb] font-semibold tracking-[0.05em] ml-[5px] uppercase flex-shrink-0"
          >
            {{ block.type }}
          </span>

          <!-- Delete -->
          <button
            v-if="hoveredIdx === i"
            type="button"
            class="border-none bg-transparent text-[#ccc] cursor-pointer text-[17px] p-0 pl-1.5 leading-none flex-shrink-0 transition-colors duration-100 hover:text-[#e53e3e]"
            @click.stop="$emit('delete', block.uuid)"
          >
            &times;
          </button>
        </div>

        <!-- Drop indicator below -->
        <div
          v-if="dragState && dragState.fromIdx !== i && dragState.overIdx === i && dragState.fromIdx < i"
          class="h-[3px] bg-[#1D5EC7] mx-2.5 my-px rounded-sm"
        />
      </div>
    </div>

    <!-- Add Element button + quick pills -->
    <div class="px-3.5 pt-2.5 pb-3">
      <button
        type="button"
        class="w-full py-2 rounded-[7px] border border-[#e2e2e2] bg-white text-[#555] text-[13px] cursor-pointer flex items-center justify-center gap-[5px] transition-all duration-100 hover:bg-[#f5f5f5] hover:border-[#ccc]"
        @click="$emit('addElement')"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v11M1 6.5h11" stroke="#888" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        Add Element
      </button>

      <!-- Quick-add pills -->
      <div class="flex gap-[5px] mt-[7px]">
        <button
          v-for="pill in quickPills"
          :key="pill.type"
          type="button"
          class="flex-1 py-[5px] px-1 rounded-[14px] border border-[#e5e5e5] bg-[#f8f8f8] text-[#666] text-[11px] cursor-pointer flex items-center justify-center gap-[3px] transition-all duration-100 hover:bg-[#eff4ff] hover:border-[#b8d0ff] hover:text-[#1D5EC7]"
          @click="$emit('quickAdd', pill.type)"
        >
          <span class="text-[13px]">{{ pill.icon }}</span>
          <span>{{ pill.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ElementBlock {
  uuid: string;
  label: string;
  span: number;
  color: string;
  type: string;
}

defineProps<{
  blocks: ElementBlock[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [uuid: string];
  delete: [uuid: string];
  reorder: [fromIdx: number, toIdx: number];
  addElement: [];
  quickAdd: [type: string];
}>();

const hoveredIdx = ref(-1);
const listRef = ref<HTMLElement | null>(null);
const dragState = ref<{ fromIdx: number; overIdx: number } | null>(null);
const dragRef = ref<{ fromIdx: number; overIdx: number } | null>(null);

const quickPills = [
  { type: 'image', icon: '\u229E', label: 'Image' },
  { type: 'text', icon: 'T', label: 'Text' },
  { type: 'grid', icon: '\u22A0', label: 'Grid' },
];

const startDrag = (e: PointerEvent, idx: number) => {
  dragRef.value = { fromIdx: idx, overIdx: idx };
  dragState.value = { fromIdx: idx, overIdx: idx };

  const onMove = (ev: PointerEvent) => {
    if (!listRef.value || !dragRef.value) return;
    const items = [...listRef.value.querySelectorAll('[data-el-item]')];
    let over = dragRef.value.fromIdx;
    for (let i = 0; i < items.length; i++) {
      const r = items[i]!.getBoundingClientRect();
      if (ev.clientY < r.top + r.height / 2) {
        over = i;
        break;
      }
      over = i;
    }
    dragRef.value.overIdx = over;
    dragState.value = { fromIdx: dragRef.value.fromIdx, overIdx: over };
  };

  const onUp = () => {
    if (dragRef.value) {
      const { fromIdx, overIdx } = dragRef.value;
      if (fromIdx !== overIdx) {
        emit('reorder', fromIdx, overIdx);
      }
    }
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    dragRef.value = null;
    dragState.value = null;
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
};
</script>
