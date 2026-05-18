<template>
  <EditorFormPanel v-model="isOpen" content-class="p-0">
    <template #title>
      <span class="inline-flex items-center gap-1.5">
        {{ getEditorTranslation('elements') }}
        <span
          v-if="totalCount > 0"
          class="text-3xs font-bold px-1.5 py-0.5 rounded-full"
          :class="
            filledCount === totalCount
              ? 'bg-editor-accent/10 text-editor-accent'
              : 'bg-editor-surface-muted text-editor-text-ghost'
          "
          >{{ filledCount }}/{{ totalCount }}</span
        >
      </span>
    </template>

    <draggable v-model="localItems" item-key="meta.uuid" handle=".el-drag-handle" :filter="'.no-drag'" @end="onDragEnd">
      <template #item="{ element: block }">
        <div class="relative">
          <div
            v-if="!props.customAdd"
            class="no-drag absolute inset-x-0 top-0 -translate-y-1/2 h-3 z-20 flex items-center justify-center cursor-pointer"
            @mouseenter="insertHoveredUuid = block.meta.uuid"
            @mouseleave="insertHoveredUuid = null"
            @click.stop="onInsertBefore(block, $event)"
          >
            <div
              class="absolute inset-x-0 top-1/2 h-px transition-opacity duration-150"
              :class="insertHoveredUuid === block.meta.uuid ? 'bg-editor-accent opacity-100' : 'opacity-0'"
            />
            <div
              v-show="insertHoveredUuid === block.meta.uuid"
              class="relative w-4 h-4 rounded-full bg-editor-accent text-white flex items-center justify-center flex-shrink-0 z-10 shadow-sm"
            >
              <SfIconAdd size="xs" />
            </div>
          </div>

          <div
            data-el-item
            class="group/el flex items-center gap-1.5 px-2 py-1.5 border-b border-editor-border transition-colors hover:bg-editor-toc-hover"
            :class="{ 'bg-editor-toc-hover': openMenuUuid === block.meta.uuid }"
            @mouseenter="hoveredUuid = block.meta.uuid"
            @mouseleave="hoveredUuid = null"
          >
            <button
              class="el-drag-handle cursor-grab active:cursor-grabbing text-editor-text-dim hover:text-editor-text-placeholder p-0.5 flex-shrink-0 text-3xs tracking-[0.3px] leading-none"
              :aria-label="getEditorTranslation('drag-handle-aria')"
            >
              ⋮⋮
            </button>

            <div
              class="w-2.5 h-2.5 flex-shrink-0 rounded-sm"
              :class="block.name === 'EmptyGridBlock' ? 'border border-dashed border-editor-text-ghost' : ''"
              :style="
                block.name !== 'EmptyGridBlock'
                  ? { backgroundColor: getBlockColor(block.name, isVisible(block) ? 1 : 0.35) }
                  : undefined
              "
            />

            <span
              class="flex-1 text-xs truncate min-w-0"
              :class="
                block.name !== 'EmptyGridBlock'
                  ? isVisible(block)
                    ? 'text-editor-text-default'
                    : 'text-editor-text-ghost line-through'
                  : 'text-editor-text-ghost italic'
              "
            >
              {{
                block.name !== 'EmptyGridBlock' ? getBlockDisplayName(block.name) : getEditorTranslation('empty-block')
              }}
            </span>

            <SfIconVisibilityOff
              v-if="block.name !== 'EmptyGridBlock' && !isVisible(block)"
              size="xs"
              class="flex-shrink-0 text-editor-text-ghost"
            />

            <span
              v-if="isGridMode && (hoveredUuid === block.meta.uuid || openMenuUuid === block.meta.uuid)"
              class="text-3xs font-bold px-1 py-0.5 rounded flex-shrink-0"
              :class="
                block.name !== 'EmptyGridBlock'
                  ? 'bg-editor-accent/10 text-editor-accent'
                  : 'bg-editor-surface-muted text-editor-text-ghost'
              "
              >{{ getBlockSpan(block) }}/12</span
            >

            <button
              v-if="hoveredUuid === block.meta.uuid && block.name !== 'EmptyGridBlock'"
              class="no-drag p-0.5 rounded cursor-pointer text-editor-text-placeholder hover:text-editor-accent flex-shrink-0"
              :aria-label="getEditorTranslation('edit-aria')"
              @click.stop="emit('edit-element', block)"
            >
              <SfIconBase size="xs" viewBox="0 0 18 18">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path :d="editPath" fill="currentColor" />
                </svg>
              </SfIconBase>
            </button>

            <button
              v-if="hoveredUuid === block.meta.uuid && block.name === 'EmptyGridBlock'"
              class="no-drag text-3xs font-bold tracking-wider uppercase text-editor-accent flex-shrink-0 cursor-pointer"
              @click.stop="onReplaceEmpty($event, block)"
            >
              {{ getEditorTranslation('replace') }}
            </button>

            <div class="no-drag relative flex-shrink-0">
              <button
                class="p-0.5 rounded cursor-pointer text-editor-text-placeholder hover:text-editor-text-subtle opacity-0 group-hover/el:opacity-100 transition-opacity"
                :class="{ 'opacity-100': openMenuUuid === block.meta.uuid }"
                :aria-label="getEditorTranslation('actions-aria')"
                @click.stop="toggleMenu(block.meta.uuid)"
              >
                <SfIconMoreVert size="xs" />
              </button>

              <div
                v-if="openMenuUuid === block.meta.uuid"
                class="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-editor-border z-50"
                @click.stop
              >
                <div class="px-3 py-2.5 border-b border-editor-border flex items-center justify-between gap-2">
                  <span class="text-xs text-editor-text-subtle">{{ getEditorTranslation('visibility') }}</span>
                  <SfSwitch
                    :model-value="isVisible(block)"
                    class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
                    @update:model-value="onToggleVisibility(block)"
                  />
                </div>
                <button
                  class="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="minItemsReached"
                  @click="onDelete(block)"
                >
                  <SfIconDelete size="xs" />
                  {{ getEditorTranslation('delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <div v-if="totalCount === 0" class="px-3.5 py-4 text-xs text-editor-text-ghost text-center italic">
      {{ getEditorTranslation('no-elements') }}
    </div>

    <div class="px-3.5 py-2.5 border-t border-editor-border">
      <button
        ref="addButtonRef"
        type="button"
        class="w-full py-1.5 rounded-md border border-editor-accent/40 flex items-center justify-center gap-1.5 text-xs text-editor-accent hover:bg-editor-accent/[4%] transition-colors"
        @click="props.customAdd ? emit('add-element') : onAddElement()"
      >
        <SfIconAdd size="xs" />
        {{ getEditorTranslation('add-element') }}
      </button>
    </div>
  </EditorFormPanel>
</template>

<script setup lang="ts">
import { SfSwitch, SfIconMoreVert, SfIconDelete, SfIconAdd, SfIconBase, SfIconVisibilityOff } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import type { Block } from '@plentymarkets/shop-api';
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import type { GridElementsPanelProps, GridElementsPanelEmits } from './types';
import { editPath } from '~/assets/icons/paths/edit';

const props = withDefaults(defineProps<GridElementsPanelProps>(), {
  modelValue: true,
  minItems: 0,
  customAdd: false,
});
const emit = defineEmits<GridElementsPanelEmits>();

const addButtonRef = ref<HTMLButtonElement | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const enableAddBlockPopover = useRuntimeConfig().public.enableAddBlockPopover as boolean;

const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid, togglePlaceholder } = useBlockManager();
const { openAddBlockPopover } = useAddBlockPopover();
const { toggleBlockVisibility } = useBlocksVisibility();
const { openDrawerWithView } = useSiteConfiguration();
const { clearInsertColumnUuid, setInsertColumnUuid } = useBlocksMutations();

const structure = computed(() => findOrDeleteBlockByUuid(data.value, props.uuid) as ColumnBlock | undefined);
const isGridMode = computed(() => Array.isArray(structure.value?.configuration?.columnWidths));
const columnWidths = computed(() => structure.value?.configuration?.columnWidths ?? []);

const sortedItems = computed((): Block[] => {
  const content = (structure.value?.content as Block[] | undefined) ?? [];
  if (isGridMode.value) {
    return [...content].sort((a, b) => (a.parent_slot ?? 0) - (b.parent_slot ?? 0));
  }
  return [...content];
});

const localItems = ref<Block[]>([]);

watch(
  () => sortedItems.value.map((b) => b.meta.uuid).join(','),
  () => {
    localItems.value = [...sortedItems.value];
  },
  { immediate: true },
);

const totalCount = computed(() => sortedItems.value.length);
const filledCount = computed(() => sortedItems.value.filter((b) => b.name !== 'EmptyGridBlock').length);
const minItemsReached = computed(() => sortedItems.value.length <= props.minItems);

const hoveredUuid = ref<string | null>(null);
const openMenuUuid = ref<string | null>(null);
const insertHoveredUuid = ref<string | null>(null);

const onInsertBefore = (block: Block, event: MouseEvent) => {
  if (isGridMode.value) {
    emit('insert-before', block, event.currentTarget as HTMLElement);
  } else if (enableAddBlockPopover) {
    openAddBlockPopover({ anchorEl: event.currentTarget as HTMLElement, targetUuid: block.meta.uuid, position: 'top' });
  } else {
    togglePlaceholder(block.meta.uuid, 'top');
    openDrawerWithView('blocksList');
    clearInsertColumnUuid();
  }
};

const toggleMenu = (uuid: string) => {
  openMenuUuid.value = openMenuUuid.value === uuid ? null : uuid;
};

onMounted(() => {
  const close = () => {
    openMenuUuid.value = null;
  };
  document.addEventListener('click', close);
  onBeforeUnmount(() => document.removeEventListener('click', close));
});

const getBlockSpan = (block: Block): number => columnWidths.value[block.parent_slot ?? 0] ?? 0;
const isVisible = (block: Block): boolean => (block.configuration as Record<string, unknown>)?.visible !== false;

const onToggleVisibility = (block: Block) => {
  toggleBlockVisibility(block);
  openMenuUuid.value = null;
};

const onDelete = (block: Block) => {
  if (!structure.value || minItemsReached.value) return;
  const content = structure.value.content as Block[];
  const idx = content.findIndex((b) => b.meta.uuid === block.meta.uuid);
  if (idx !== -1) content.splice(idx, 1);
  if (isGridMode.value) {
    const slot = block.parent_slot ?? 0;
    structure.value.configuration.columnWidths.splice(slot, 1);
    content.forEach((b) => {
      if ((b.parent_slot ?? 0) > slot) b.parent_slot = (b.parent_slot ?? 0) - 1;
    });
  }
  openMenuUuid.value = null;
};

const onReplaceEmpty = (event: MouseEvent, block: Block) => {
  if (enableAddBlockPopover) {
    openAddBlockPopover({
      anchorEl: event.currentTarget as HTMLElement,
      targetUuid: block.meta.uuid,
      position: 'inside',
    });
  } else {
    setInsertColumnUuid(block.meta.uuid);
    openDrawerWithView('blocksList');
  }
};

const onDragEnd = () => {
  if (!structure.value) return;
  if (isGridMode.value) {
    const newWidths = localItems.value.map((b) => columnWidths.value[b.parent_slot ?? 0] ?? 12);
    const content = structure.value.content as Block[];
    localItems.value.forEach((nb, i) => {
      const original = content.find((b) => b.meta.uuid === nb.meta.uuid);
      if (original) original.parent_slot = i;
    });
    structure.value.configuration.columnWidths = newWidths;
  } else {
    structure.value.content = [...localItems.value];
  }
};

const addRowSpans = (spans: readonly number[]) => {
  if (!structure.value) return;
  const block = structure.value;
  const currentLength = block.configuration.columnWidths.length;
  block.configuration.columnWidths.push(...spans);
  if (!block.content) block.content = [];
  (block.content as Block[]).push(
    ...(spans.map((_, i) => createEmptyGridBlock(currentLength + i)) as unknown as Block[]),
  );
};

const onAddElement = () => {
  if (!structure.value) return;
  const anchorEl = addButtonRef.value as HTMLElement;

  if (isGridMode.value) {
    const block = structure.value;
    const newSlot = block.configuration.columnWidths.length;
    const newBlock = createEmptyGridBlock(newSlot);

    block.configuration.columnWidths.push(12);
    if (!block.content) block.content = [];
    (block.content as Block[]).push(newBlock as unknown as Block);

    if (enableAddBlockPopover) {
      const cleanupTempBlock = () => {
        const content = block.content as Block[];
        const index = content.findIndex((b) => b.meta.uuid === newBlock.meta.uuid && b.name === 'EmptyGridBlock');
        if (index !== -1) {
          content.splice(index, 1);
          block.configuration.columnWidths.splice(newSlot, 1);
        }
      };
      openAddBlockPopover({
        anchorEl,
        targetUuid: newBlock.meta.uuid,
        position: 'inside',
        onCancel: cleanupTempBlock,
        onPresetPick: (spans) => {
          cleanupTempBlock();
          addRowSpans(spans);
        },
      });
    } else {
      setInsertColumnUuid(newBlock.meta.uuid);
      openDrawerWithView('blocksList');
    }
  } else {
    const content = (structure.value.content as Block[] | undefined) ?? [];
    const lastBlock = content.at(-1);
    if (!lastBlock) return;
    if (enableAddBlockPopover) {
      openAddBlockPopover({ anchorEl, targetUuid: lastBlock.meta.uuid, position: 'bottom' });
    } else {
      togglePlaceholder(lastBlock.meta.uuid, 'bottom');
      openDrawerWithView('blocksList');
      clearInsertColumnUuid();
    }
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "elements": "Elements",
    "empty-block": "Empty Block",
    "replace": "Replace",
    "visibility": "Visibility",
    "delete": "Delete",
    "add-element": "Add Element",
    "no-elements": "No elements yet — choose a layout below.",
    "drag-handle-aria": "Drag to reorder",
    "actions-aria": "Block actions",
    "edit-aria": "Edit block"
  },
  "de": {
    "elements": "Elements",
    "empty-block": "Empty Block",
    "replace": "Replace",
    "visibility": "Visibility",
    "delete": "Delete",
    "add-element": "Add Element",
    "no-elements": "No elements yet — choose a layout below.",
    "drag-handle-aria": "Drag to reorder",
    "actions-aria": "Block actions",
    "edit-aria": "Edit block"
  }
}
</i18n>
