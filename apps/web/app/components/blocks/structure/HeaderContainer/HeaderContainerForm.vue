<template>
  <div data-testid="header-container-form" class="block-header-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="editingBlockIndex === undefined" class="space-y-0">
      <EditorBlockItemsAccordion
        v-model="elementsOpen"
        :items="blocks"
        :item-labels="blockLabels"
        :current-active-index="currentActiveBlockIndex"
        :min-items="1"
        @select-item="selectBlock"
        @edit-item="editBlock"
        @add-item="addBlock"
        @delete-item="deleteBlock"
        @toggle-item-visibility="toggleBlockVisibilityHandler"
        @update:items="updateBlocks"
      />

      <UiAccordionItem
        v-model="layoutOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2 data-testid="slider-button-group-title">{{ getEditorTranslation('layout-label') }}</h2>
        </template>
        <UiFieldToggle v-model="isStickyToggle" :label="getEditorTranslation('is-sticky-label')" />
      </UiAccordionItem>
    </div>

    <div v-else-if="blocks[editingBlockIndex]" class="space-y-0">
      <component :is="blockForm" ref="innerFormRef" :uuid="blocks[editingBlockIndex]!.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { Block } from '@plentymarkets/shop-api';
import type { SlideBlock } from '~/components/blocks/structure/Carousel/types';

const { toggleBlockVisibility } = useBlocksVisibility();
const { headerContainer } = useBlocks();
const { scrollToBlock, highlightTimeoutToken, highlightedUuid } = useTableOfContents();

const { setEditTitle, clearEditTitle } = useBlockEditTitle();

const innerFormRef = ref<{ exitEditMode?: (shouldEmit?: boolean) => void; isSubEditing?: boolean } | null>(null);

const elementsOpen = ref(true);
const editingBlockIndex = ref<number | undefined>(undefined);
const editingBlockName = ref<string | undefined>(undefined);
const blockLabels = ref<string[]>([]);
const currentActiveBlockIndex = ref<number>(-1);
const layoutOpen = ref(true);

const blockForm = computed(() => {
  if (!editingBlockName.value) {
    return null;
  }

  const loader = getBlockFormLoader(editingBlockName.value);
  return loader ? defineAsyncComponent(loader) : null;
});

const headerContainerStructure = computed(() => (headerContainer.value ?? {}) as HeaderContainerBlock);

const isStickyToggle = computed({
  get: () => headerContainerStructure.value.configuration?.layout?.sticky ?? false,
  set: (value: boolean) => {
    if (!headerContainerStructure.value.configuration) {
      headerContainerStructure.value.configuration = {
        visible: true,
      };
    }
    if (!headerContainerStructure.value.configuration?.layout) {
      headerContainerStructure.value.configuration.layout = {};
    }
    headerContainerStructure.value.configuration.layout.sticky = value;
  },
});

const blocks = computed({
  get: () => {
    const content = (headerContainerStructure.value?.content || []) as SlideBlock[];
    return content.map((block: Block) => ({
      ...block,
      configuration: {
        ...(block.configuration as Record<string, unknown>),
        visible: (block.configuration as Record<string, unknown>)?.visible !== false,
      },
    }));
  },
  set: (value: SlideBlock[]) => {
    headerContainerStructure.value.content = value.map((block, index) => ({
      ...block,
      parent_slot: index,
    }));
  },
});

const resolveBlockLabels = async () => {
  blockLabels.value = await Promise.all(blocks.value.map((block) => getBlockDisplayName(block.name)));
};

const hasValidActiveBlock = computed(() => 
  currentActiveBlockIndex.value >= 0 && currentActiveBlockIndex.value < blocks.value.length
);

const selectBlock = (index: number) => {
  currentActiveBlockIndex.value = index;
  const block = blocks.value[index];
  if (block) {
    scrollToBlock(block.meta.uuid);
    highlightTimeoutToken.value++;
  }
};

const editBlock = (index: number) => {
  editingBlockIndex.value = index;
  editingBlockName.value = headerContainerStructure.value?.content?.[index]?.name;
  currentActiveBlockIndex.value = index;
  const block = blocks.value[index];
  if (block) {
    scrollToBlock(block.meta.uuid);
    highlightTimeoutToken.value++;
  }
  setEditTitle(blockLabels.value[index]!);
};

const exitEditMode = (shouldEmit = true): boolean => {
  if (innerFormRef.value?.isSubEditing && innerFormRef.value?.exitEditMode) {
    innerFormRef.value.exitEditMode(false);
    const blockLabel = editingBlockIndex.value === undefined ? undefined : blockLabels.value[editingBlockIndex.value];
    if (blockLabel) {
      setEditTitle(blockLabel);
    }
    return false;
  }

  editingBlockIndex.value = undefined;
  editingBlockName.value = undefined;
  if (shouldEmit) {
    clearEditTitle();
  }
  resolveBlockLabels();
  return true;
};

const addBlock = () => {
  const { openDrawerWithView } = useSiteConfiguration();
  const { togglePlaceholder } = useBlockManager();

  const lastChild = headerContainerStructure.value.content?.[headerContainerStructure.value.content.length - 1];

  if (!lastChild) {
    return;
  }

  togglePlaceholder(lastChild.meta.uuid, 'bottom');
  openDrawerWithView('blocksList');
};

const deleteBlock = async (index: number) => {
  if (blocks.value.length <= 1) {
    return;
  }
  blocks.value = blocks.value.filter((_: Block, i: number) => i !== index);
  currentActiveBlockIndex.value = -1;
  await nextTick();
  if (editingBlockIndex.value === index) {
    exitEditMode();
  }
};

const updateBlocks = (newBlocks: SlideBlock[]) => {
  blocks.value = newBlocks;
  
  if (hasValidActiveBlock.value) {
    const activeBlock = blocks.value[currentActiveBlockIndex.value];
    if (activeBlock) {
      scrollToBlock(activeBlock.meta.uuid);
      highlightTimeoutToken.value++;
    }
  }
};

const toggleBlockVisibilityHandler = (index: number) => {
  const block = blocks.value[index];
  if (!block) {
    return;
  }

  const updatedBlocks = [...blocks.value];
  const blockToUpdate = updatedBlocks[index];
  if (!blockToUpdate) {
    return;
  }

  toggleBlockVisibility(blockToUpdate);
  blocks.value = updatedBlocks;
};

const previousBlocksLength = ref(blocks.value.length);

watch(
  () => blocks.value.map((block) => block.meta.uuid),
  (newUuids) => {
    resolveBlockLabels();
    
    if (newUuids.length > previousBlocksLength.value) {
      const newBlockIndex = blocks.value.length - 1;
      selectBlock(newBlockIndex);
    }
    
    previousBlocksLength.value = newUuids.length;
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  highlightedUuid.value = '';
  currentActiveBlockIndex.value = -1;
});

defineExpose({
  exitEditMode,
});
</script>

<i18n lang="json">
{
  "en": {
    "layout-label": "Layout",
    "is-sticky-label": "Is Sticky"
  },
  "de": {
    "layout-label": "Layout",
    "is-sticky-label": "Is Sticky"
  }
}
</i18n>
