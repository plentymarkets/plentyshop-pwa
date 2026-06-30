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

    <draggable
      v-model="localItems"
      item-key="meta.uuid"
      handle=".el-drag-handle"
      :filter="'.no-drag'"
      :move="props.canMove"
      @end="onDragEnd"
    >
      <template #item="{ element: block, index }">
        <EditorGridElementsPanelGridElementsItem
          :block="block"
          :index="index"
          :menu-open="openMenuUuid === block.meta.uuid"
          :custom-add="props.customAdd"
          :is-grid-mode="isGridMode"
          :block-span="gridColumnsWidth[block.parent_slot ?? 0] ?? 0"
          :min-items-reached="minItemsReached"
          :is-active="currentActiveBlockIndex === index"
          :parent-uuid="props.uuid"
          :custom-label="props.customLabel(block)"
          @insert-before="onInsertBefore"
          @edit-element="emit('edit-element', $event)"
          @replace-empty="onReplaceEmpty"
          @toggle-menu="toggleMenu"
          @toggle-visibility="onToggleVisibility"
          @delete="onDelete"
          @select="selectBlock"
        />
      </template>
    </draggable>

    <div v-if="totalCount === 0" class="px-3.5 py-4 text-xs text-editor-text-ghost text-center italic">
      {{ getEditorTranslation('no-elements') }}
    </div>

    <div class="border-t border-editor-border">
      <div class="px-3.5 py-2.5">
        <button
          ref="addButtonRef"
          type="button"
          data-testid="actions-add-block-button"
          class="w-full py-1.5 rounded-md border border-editor-accent/40 flex items-center justify-center gap-1.5 text-xs text-editor-accent hover:bg-editor-accent/[4%] transition-colors"
          @click="props.customAdd ? emit('add-element') : onAddElement()"
        >
          <SfIconAdd size="xs" />
          {{ getEditorTranslation('add-element') }}
        </button>
      </div>

      <EditorQuickAdd
        v-if="!props.customAdd && (props.quickAddOptions?.length ?? 0) > 0"
        :options="props.quickAddOptions ?? []"
        :block-uuid="props.uuid"
        class="pb-2.5"
      />
    </div>
  </EditorFormPanel>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import type { Block } from '@plentymarkets/shop-api';
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import { useMultiGridDeviceWidths } from '~/components/blocks/structure/MultiGrid/multiGridDeviceWidths';
import type { GridElementsPanelProps, GridElementsPanelEmits } from './types';

const props = withDefaults(defineProps<GridElementsPanelProps>(), {
  modelValue: true,
  minItems: 0,
  customAdd: false,
  customLabel: () => '',
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
const { widths: gridColumnsWidth, setWidths: setGridColumnsWidth } = useMultiGridDeviceWidths(
  computed(() => structure.value?.configuration ?? { columnWidths: [] as number[] }),
);

const sortedItems = computed((): Block[] => {
  const content = (structure.value?.content as Block[] | undefined) ?? [];
  if (isGridMode.value) {
    return [...content].sort((a, b) => (a.parent_slot ?? 0) - (b.parent_slot ?? 0));
  }
  return [...content];
});

const { currentActiveBlockIndex, selectBlock } = useBlocksHighlight(sortedItems);

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

const openMenuUuid = ref<string | null>(null);

const onInsertBefore = (block: Block, anchorEl: HTMLElement) => {
  if (isGridMode.value) {
    emit('insert-before', block, anchorEl);
  } else if (enableAddBlockPopover) {
    openAddBlockPopover({ anchorEl, targetUuid: block.meta.uuid, position: 'top' });
  } else {
    togglePlaceholder(block.meta.uuid, 'top');
    openDrawerWithView('blocksList');
    clearInsertColumnUuid();
  }
};

const toggleMenu = (uuid: string) => {
  openMenuUuid.value = openMenuUuid.value === uuid ? null : uuid;
};

const closeMenu = () => {
  openMenuUuid.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu);
});

const onToggleVisibility = (block: Block) => {
  toggleBlockVisibility(block);
  openMenuUuid.value = null;
};

const onDelete = (block: Block) => {
  if (!structure.value || minItemsReached.value) return;
  removeBlockFromColumn(structure.value, block.meta.uuid);
  openMenuUuid.value = null;
};

const onReplaceEmpty = (anchorEl: HTMLElement, block: Block) => {
  if (enableAddBlockPopover) {
    openAddBlockPopover({ anchorEl, targetUuid: block.meta.uuid, position: 'inside' });
  } else {
    setInsertColumnUuid(block.meta.uuid);
    openDrawerWithView('blocksList');
  }
};

const onDragEnd = () => {
  if (!structure.value) return;
  if (isGridMode.value) {
    const newWidths = localItems.value.map((b) => gridColumnsWidth.value[b.parent_slot ?? 0] ?? 12);
    const content = structure.value.content as Block[];
    localItems.value.forEach((nb, i) => {
      const original = content.find((b) => b.meta.uuid === nb.meta.uuid);
      if (original) original.parent_slot = i;
    });
    setGridColumnsWidth(newWidths);
  } else {
    const content = structure.value.content as Block[] | undefined;
    const reordered = localItems.value.map((block, index) => ({ ...block, parent_slot: index }));

    if (Array.isArray(content)) {
      content.splice(0, content.length, ...reordered);
    } else {
      structure.value.content = [...reordered];
    }
  }
};

const addRowSpans = (spans: readonly number[]) => {
  if (!structure.value) return;
  const block = structure.value;
  const currentLength = block.configuration.columnWidths.length;
  block.configuration.columnWidths.push(...spans);
  if (block.configuration.columnWidthsTablet) block.configuration.columnWidthsTablet.push(...spans);
  if (block.configuration.columnWidthsMobile) block.configuration.columnWidthsMobile.push(...spans);
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
    if (block.configuration.columnWidthsTablet) block.configuration.columnWidthsTablet.push(12);
    if (block.configuration.columnWidthsMobile) block.configuration.columnWidthsMobile.push(12);
    if (!block.content) block.content = [];
    (block.content as Block[]).push(newBlock as unknown as Block);

    if (enableAddBlockPopover) {
      const cleanupTempBlock = () => {
        const content = block.content as Block[];
        const index = content.findIndex((b) => b.meta.uuid === newBlock.meta.uuid && b.name === 'EmptyGridBlock');
        if (index !== -1) {
          content.splice(index, 1);
          block.configuration.columnWidths.splice(newSlot, 1);
          if (block.configuration.columnWidthsTablet) block.configuration.columnWidthsTablet.splice(newSlot, 1);
          if (block.configuration.columnWidthsMobile) block.configuration.columnWidthsMobile.splice(newSlot, 1);
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
    "add-element": "Add Element",
    "no-elements": "No elements yet — choose a layout below."
  },
  "de": {
    "elements": "Elements",
    "add-element": "Add Element",
    "no-elements": "No elements yet — choose a layout below."
  }
}
</i18n>
