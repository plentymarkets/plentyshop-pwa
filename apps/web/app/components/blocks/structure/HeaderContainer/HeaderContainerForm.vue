<template>
  <div data-testid="header-container-form" class="block-header-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="editingBlockIndex === undefined" class="space-y-0">
      <EditorBlockItemsAccordion
        v-model="elementsOpen"
        :items="blocks"
        :item-labels="blockLabels"
        :current-active-index="currentActiveBlockIndex"
        :min-items="1"
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
      <component
        :is="blockForm"
        ref="innerFormRef"
        :uuid="blocks[editingBlockIndex]!.meta.uuid"
        @set-edit-title="handleInnerSetEditTitle"
        @clear-edit-title="handleInnerClearEditTitle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { Block } from '@plentymarkets/shop-api';
import type { SlideBlock } from '~/components/blocks/structure/Carousel/types';

const { blockUuid } = useSiteConfiguration();
const { toggleBlockVisibility } = useBlocksVisibility();
const { data } = useBlockTemplates('index', 'immutable', useNuxtApp().$i18n.locale.value);
const { findOrDeleteBlockByUuid } = useBlockManager();

const emit = defineEmits<{
  'set-edit-title': [title: string];
  'clear-edit-title': [];
}>();

const innerFormRef = ref<{ exitEditMode?: (shouldEmit?: boolean) => void } | null>(null);
const isInnerFormSubEditing = ref(false);

const elementsOpen = ref(true);
const editingBlockIndex = ref<number | undefined>(undefined);
const editingBlockName = ref<string | undefined>(undefined);
const blockLabels = ref<string[]>([]);
const currentActiveBlockIndex = ref<number>(-1);
const layoutOpen = ref(true);

const blockForm = computed(() => {
  if (!editingBlockName.value) return null;

  const loader = getBlockFormLoader(editingBlockName.value);
  return loader ? defineAsyncComponent(loader) : null;
});

const headerContainerStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as HeaderContainerBlock,
);

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
    headerContainerStructure.value.content = [...value];
  },
});

const resolveBlockLabels = async () => {
  blockLabels.value = await Promise.all(blocks.value.map((block) => getBlockDisplayName(block.name)));
};

const editBlock = (index: number) => {
  editingBlockIndex.value = index;
  editingBlockName.value = headerContainerStructure.value?.content?.[index]?.name;
  isInnerFormSubEditing.value = false;
  currentActiveBlockIndex.value = index;
  emit('set-edit-title', blockLabels.value[index]!);
};

const handleInnerSetEditTitle = (title: string) => {
  isInnerFormSubEditing.value = true;
  emit('set-edit-title', title);
};

const handleInnerClearEditTitle = () => {
  isInnerFormSubEditing.value = false;
  const blockLabel = editingBlockIndex.value !== undefined ? blockLabels.value[editingBlockIndex.value] : undefined;
  if (blockLabel) emit('set-edit-title', blockLabel);
};

const exitEditMode = (shouldEmit = true): boolean => {
  if (isInnerFormSubEditing.value && innerFormRef.value?.exitEditMode) {
    innerFormRef.value.exitEditMode(false);
    isInnerFormSubEditing.value = false;
    const blockLabel = editingBlockIndex.value !== undefined ? blockLabels.value[editingBlockIndex.value] : undefined;
    if (blockLabel) emit('set-edit-title', blockLabel);
    return false;
  }

  editingBlockIndex.value = undefined;
  editingBlockName.value = undefined;
  currentActiveBlockIndex.value = -1;
  if (shouldEmit) emit('clear-edit-title');
  resolveBlockLabels();
  return true;
};

const addBlock = () => {
  const { openDrawerWithView } = useSiteConfiguration();
  const { togglePlaceholder } = useBlockManager();

  const lastChild = headerContainerStructure.value.content?.[headerContainerStructure.value.content.length - 1];

  if (!lastChild) return;

  togglePlaceholder(lastChild.meta.uuid, 'bottom');
  openDrawerWithView('blocksList');
};

const deleteBlock = async (index: number) => {
  if (blocks.value.length <= 1) return;
  blocks.value = blocks.value.filter((_: Block, i: number) => i !== index);
  currentActiveBlockIndex.value = 0;
  await nextTick();
  if (editingBlockIndex.value === index) {
    exitEditMode();
  }
};

const updateBlocks = (newBlocks: SlideBlock[]) => {
  blocks.value = newBlocks;
};

const toggleBlockVisibilityHandler = (index: number) => {
  const block = blocks.value[index];
  if (!block) return;

  const updatedBlocks = [...blocks.value];
  const blockToUpdate = updatedBlocks[index];
  if (!blockToUpdate) return;

  toggleBlockVisibility(blockToUpdate);
  blocks.value = updatedBlocks;
};

watch(
  () => blocks.value.map((block) => block.meta.uuid),
  () => {
    resolveBlockLabels();
  },
  { immediate: true },
);

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
