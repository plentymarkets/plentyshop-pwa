<template>
  <div>
    <draggable
      v-if="blocks.length"
      v-model="internalBlocks"
      item-key="uuid"
      handle=".mg-drag-handle"
      :filter="'.no-drag'"
      @end="onDragEnd"
    >
      <template #item="{ element: block, index: i }">
        <div
          :key="block.uuid"
          class="flex items-center py-[7px] px-2 pr-2.5 border-b border-[#f2f2f2] transition-colors duration-100"
          :class="[
            block.uuid === selectedId
              ? 'bg-[#eef3ff] outline outline-1 outline-[#d0deff] -outline-offset-1'
              : 'hover:bg-[#fafafa]',
          ]"
          @click="$emit('select', block.uuid)"
        >
          <!-- Drag handle -->
          <button
            class="mg-drag-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Drag to reorder"
          >
            <NuxtImg width="18" height="18" :src="dragIcon" />
          </button>

          <!-- Color swatch -->
          <div
            class="w-2.5 h-2.5 rounded-[3px] flex-shrink-0 mr-2"
            :style="{ background: block.color }"
          />

          <!-- Label -->
          <span
            class="flex-1 text-[13px] text-[#1a1a1a] overflow-hidden text-ellipsis whitespace-nowrap"
            :class="[
              block.uuid === selectedId ? 'font-medium' : '',
              !block.visible ? 'text-gray-400' : '',
            ]"
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

          <!-- Edit button -->
          <button
            class="text-gray-500 rounded-full no-drag ml-1 p-0.5"
            aria-label="Edit block"
            :data-testid="`mg-edit-item-${i}`"
            @click.stop="$emit('edit', i)"
          >
            <SfIconBase size="xs" viewBox="0 0 18 18">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="editPath" fill="currentColor" />
              </svg>
            </SfIconBase>
          </button>

          <!-- Action menu -->
          <div class="relative no-drag">
            <button
              class="text-gray-500 rounded-full p-0.5"
              :data-testid="`mg-menu-item-${i}`"
              @click.stop="toggleMenu(i)"
            >
              <SfIconMoreVert size="sm" />
            </button>

            <div
              v-if="openMenuIndex === i"
              class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50"
              @click.stop
            >
              <div class="px-4 py-3 border-b">
                <div class="flex items-center justify-between">
                  <UiFormLabel class="mb-0">Visibility</UiFormLabel>
                  <SfSwitch
                    :model-value="block.visible"
                    :data-testid="`mg-toggle-visibility-${i}`"
                    class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
                    @update:model-value="$emit('toggleVisibility', i); openMenuIndex = undefined"
                  />
                </div>
              </div>

              <button
                :data-testid="`mg-delete-item-${i}`"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                @click.stop="$emit('delete', i); openMenuIndex = undefined"
              >
                <SfIconDelete size="sm" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <!-- Add Element button + quick pills -->
    <div class="px-3.5 pt-2.5 pb-3">
      <button
        type="button"
        data-testid="mg-add-element-btn"
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
import { SfIconDelete, SfIconMoreVert, SfIconBase, SfSwitch } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import dragIcon from '~/assets/icons/paths/drag.svg';
import { editPath } from '~/assets/icons/paths/edit';

export interface ElementBlock {
  uuid: string;
  label: string;
  span: number;
  color: string;
  type: string;
  visible: boolean;
}

const props = defineProps<{
  blocks: ElementBlock[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [uuid: string];
  edit: [index: number];
  delete: [index: number];
  toggleVisibility: [index: number];
  reorder: [blocks: ElementBlock[]];
  addElement: [];
  quickAdd: [type: string];
}>();

const openMenuIndex = ref<number | undefined>(undefined);

const internalBlocks = computed<ElementBlock[]>({
  get: () => props.blocks,
  set: (value: ElementBlock[]) => emit('reorder', value),
});

const toggleMenu = (index: number) => {
  openMenuIndex.value = openMenuIndex.value === index ? undefined : index;
};

const onDragEnd = (event: { newIndex: number }) => {
  emit('select', props.blocks[event.newIndex]?.uuid ?? '');
};

const quickPills = [
  { type: 'Image', icon: '\u229E', label: 'Image' },
  { type: 'TextCard', icon: 'T', label: 'Text' },
  { type: 'MultiGrid', icon: '\u22A0', label: 'Grid' },
];

// Close menu on outside click
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (openMenuIndex.value === undefined) return;
    const target = event.target as HTMLElement;
    const menuBtn = document.querySelector(`[data-testid="mg-menu-item-${openMenuIndex.value}"]`);
    const menu = menuBtn?.parentElement?.querySelector('.absolute.right-0');
    if (menuBtn && menu && !menuBtn.contains(target) && !menu.contains(target)) {
      openMenuIndex.value = undefined;
    }
  };
  document.addEventListener('click', handleClickOutside);
  onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
});
</script>
