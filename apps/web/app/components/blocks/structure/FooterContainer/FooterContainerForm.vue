<template>
  <div data-testid="footer-settings-drawer" class="block-footer-edit sticky h-[80vh] overflow-y-auto">
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
        v-model="colorsOpen"
        data-testid="color-column-section"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>{{ getEditorTranslation('colors-group-label') }}</h2>
        </template>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('colors-background-label') }}</UiFormLabel>
          </div>
          <EditorColorPicker v-model="backgroundColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <label>
                <SfInput v-model="backgroundColor" type="text" data-testid="footer-bg-color-select">
                  <template #suffix>
                    <button
                      type="button"
                      class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                      :style="{ backgroundColor: color }"
                      @mousedown.stop
                      @click.stop="toggle"
                    />
                  </template>
                </SfInput>
              </label>
            </template>
          </EditorColorPicker>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('colors-text-label') }}</UiFormLabel>
          </div>
          <EditorColorPicker v-model="textColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <label>
                <SfInput v-model="textColor" type="text" data-testid="footer-text-color-select">
                  <template #suffix>
                    <button
                      type="button"
                      class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                      :style="{ backgroundColor: color }"
                      @mousedown.stop
                      @click.stop="toggle"
                    />
                  </template>
                </SfInput>
              </label>
            </template>
          </EditorColorPicker>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('colors-link-label') }}</UiFormLabel>
          </div>
          <EditorColorPicker v-model="linkColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <label>
                <SfInput v-model="linkColor" type="text" data-testid="footer-link-color-select">
                  <template #suffix>
                    <button
                      type="button"
                      class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                      :style="{ backgroundColor: color }"
                      @mousedown.stop
                      @click.stop="toggle"
                    />
                  </template>
                </SfInput>
              </label>
            </template>
          </EditorColorPicker>
        </div>
      </UiAccordionItem>
    </div>

    <div v-else-if="blocks[editingBlockIndex]" class="space-y-0">
      <component :is="blockForm" ref="innerFormRef" :uuid="blocks[editingBlockIndex]!.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import type { FooterContainerBlock } from '~/components/blocks/structure/FooterContainer/types';
import type { Block } from '@plentymarkets/shop-api';

const { toggleBlockVisibility } = useBlocksVisibility();
const { footer } = useBlocks();

const { setEditTitle, clearEditTitle } = useBlockEditTitle();

const innerFormRef = ref<{ exitEditMode?: (shouldEmit?: boolean) => void; isSubEditing?: boolean } | null>(null);

const elementsOpen = ref(true);
const colorsOpen = ref(true);
const editingBlockIndex = ref<number | undefined>(undefined);
const editingBlockName = ref<string | undefined>(undefined);
const blockLabels = ref<string[]>([]);
const currentActiveBlockIndex = ref<number>(-1);

const footerContainer = computed(() => (footer.value ?? {}) as FooterContainerBlock);

const blockForm = computed(() => {
  if (!editingBlockName.value) {
    return null;
  }

  const loader = getBlockFormLoader(editingBlockName.value);
  return loader ? defineAsyncComponent(loader) : null;
});

const backgroundColor = computed({
  get: () => footerContainer.value.configuration?.colors?.background ?? '',
  set: (value: string) => {
    if (!footerContainer.value.configuration) {
      footerContainer.value.configuration = { visible: true };
    }
    if (!footerContainer.value.configuration.colors) {
      footerContainer.value.configuration.colors = { background: '', text: '', linkColor: '' };
    }
    footerContainer.value.configuration.colors.background = value;
  },
});

const textColor = computed({
  get: () => footerContainer.value.configuration?.colors?.text ?? '',
  set: (value: string) => {
    if (!footerContainer.value.configuration) {
      footerContainer.value.configuration = { visible: true };
    }
    if (!footerContainer.value.configuration.colors) {
      footerContainer.value.configuration.colors = { background: '', text: '', linkColor: '' };
    }
    footerContainer.value.configuration.colors.text = value;
  },
});

const linkColor = computed({
  get: () => footerContainer.value.configuration?.colors?.linkColor || '#000000',
  set: (value: string) => {
    if (!footerContainer.value.configuration) {
      footerContainer.value.configuration = { visible: true };
    }
    if (!footerContainer.value.configuration.colors) {
      footerContainer.value.configuration.colors = { background: '', text: '', linkColor: '' };
    }
    footerContainer.value.configuration.colors.linkColor = value;
  },
});

const blocks = computed({
  get: () => {
    const content = (footerContainer.value?.content || []) as Block[];
    return content.map((block: Block) => ({
      ...block,
      configuration: {
        ...(block.configuration as Record<string, unknown>),
        visible: (block.configuration as Record<string, unknown>)?.visible !== false,
      },
    }));
  },
  set: (value: Block[]) => {
    footerContainer.value.content = value;
  },
});

const resolveBlockLabels = async () => {
  blockLabels.value = await Promise.all(blocks.value.map((block) => getBlockDisplayName(block.name)));
};

const editBlock = (index: number) => {
  editingBlockIndex.value = index;
  editingBlockName.value = footerContainer.value?.content?.[index]?.name;
  currentActiveBlockIndex.value = index;
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
  currentActiveBlockIndex.value = -1;
  if (shouldEmit) {
    clearEditTitle();
  }
  resolveBlockLabels();
  return true;
};

const addBlock = (event?: MouseEvent) => {
  const content = footerContainer.value.content ?? [];
  const lastChild = content[content.length - 1];

  if (!lastChild) {
    return;
  }

  if (useRuntimeConfig().public.enableAddBlockPopover) {
    if (!event) return;
    const { openAddBlockPopover } = useAddBlockPopover();
    const anchorEl = (event.target as HTMLElement).closest('button') ?? (event.target as HTMLElement);
    openAddBlockPopover({ anchorEl, targetUuid: lastChild.meta.uuid, position: 'bottom' });
  } else {
    const { openDrawerWithView } = useSiteConfiguration();
    const { togglePlaceholder } = useBlockManager();
    const { clearInsertColumnUuid } = useBlocksMutations();
    togglePlaceholder(lastChild.meta.uuid, 'bottom');
    openDrawerWithView('blocksList');
    clearInsertColumnUuid();
  }
};

const deleteBlock = async (index: number) => {
  if (blocks.value.length <= 1) {
    return;
  }
  blocks.value = blocks.value.filter((_: Block, i: number) => i !== index);
  currentActiveBlockIndex.value = 0;
  await nextTick();
  if (editingBlockIndex.value === index) {
    exitEditMode();
  }
};

const updateBlocks = (newBlocks: Block[]) => {
  blocks.value = newBlocks;
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
    "colors-group-label": "Colour",
    "colors-background-label": "Background colour",
    "colors-text-label": "Text colour",
    "colors-link-label": "Link colour"
  },
  "de": {
    "colors-group-label": "Colour",
    "colors-background-label": "Background colour",
    "colors-text-label": "Text colour",
    "colors-link-label": "Link colour"
  }
}
</i18n>
