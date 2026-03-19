<template>
  <div data-testid="header-container-form" class="block-header-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="editingBlockIndex === undefined" class="space-y-0">
      <UiBlockItemsAccordion
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
        <EditorFullWidthToggle
          v-model="isStickyToggle"
          :label="getEditorTranslation('is-sticky-label')"
          :block-uuid="blockUuid"
        />
      </UiAccordionItem>
    </div>

    <div v-else-if="blocks[editingBlockIndex]" class="space-y-0">
      <component :is="blockForm" :uuid="blocks[editingBlockIndex]!.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { Block } from '@plentymarkets/shop-api';
import type { SlideBlock } from '~/components/blocks/structure/Carousel/types';

const { blockUuid } = useSiteConfiguration();
const { toggleBlockVisibility } = useBlocksVisibility();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const emit = defineEmits<{
  'set-edit-title': [title: string];
  'clear-edit-title': [];
}>();

const elementsOpen = ref(true);
const editingBlockIndex = ref<number | undefined>(undefined);
const blockLabels = ref<string[]>([]);
const currentActiveBlockIndex = ref<number>(-1);
const layoutOpen = ref(true);

const blockForms = import.meta.glob('@/components/**/blocks/**/*Form.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const blockForm = computed(() => {
  if (editingBlockIndex.value === undefined) return null;

  const block = blocks.value[editingBlockIndex.value];
  if (!block) return null;

  const key = Object.keys(blockForms).find((path) => path.endsWith(`/${block.name}Form.vue`));
  const loader = key ? blockForms[key] : undefined;
  return loader ? defineAsyncComponent(loader) : null;
});

const headerContainerStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as HeaderContainerBlock,
);

const isStickyToggle = computed({
  get: () => headerContainerStructure.value.configuration?.layout?.sticky ?? false,
  set: (value: boolean) => {
    if (!headerContainerStructure.value.configuration) {
      headerContainerStructure.value.configuration = {};
    }
    if (!headerContainerStructure.value.configuration.layout) {
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
  blockLabels.value = await Promise.all(blocks.value.map((block, index) => getBlockLabel(block, index)));
};

const getBlockLabel = async (block: Block, index: number): Promise<string> => {
  try {
    const module = await import(`~/components/blocks/${block.name}/defaults.ts`);
    const fallbackLabel = `${block.name} ${index + 1}`;
    const label = module.labelPath
      ? module.labelPath
          .split('.')
          .reduce((acc: unknown, key: string) => (acc as Record<string, unknown>)?.[key], block as unknown)
      : fallbackLabel;
    const strippedHtml = (() => {
      const doc = new DOMParser().parseFromString(String(label), 'text/html');
      return doc.body.textContent?.trim() || '';
    })();
    const plainText = decodeHtmlEntities(strippedHtml);
    if (!plainText) return fallbackLabel;
    return plainText.length > 30 ? plainText.slice(0, 30) + '…' : plainText;
  } catch {
    return `${block.name} ${index + 1}`;
  }
};

const editBlock = (index: number) => {
  editingBlockIndex.value = index;
  currentActiveBlockIndex.value = index;
  emit('set-edit-title', blockLabels.value[index]!);
};

const exitEditMode = (shouldEmit = true) => {
  editingBlockIndex.value = undefined;
  currentActiveBlockIndex.value = -1;
  if (shouldEmit) {
    emit('clear-edit-title');
  }
  resolveBlockLabels();
};

const addBlock = () => {
  const { openDrawerWithView } = useSiteConfiguration();
  const { multigridColumnUuid, togglePlaceholder } = useBlockManager();

  const lastChild = headerContainerStructure.value.content?.[headerContainerStructure.value.content.length - 1];

  if (!lastChild) return;

  togglePlaceholder(lastChild.meta.uuid, 'bottom');
  openDrawerWithView('blocksList');
  multigridColumnUuid.value = null;
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
