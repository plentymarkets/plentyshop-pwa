<template>
  <div data-testid="header-container-form" class="block-header-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="!editingBlock" class="space-y-0">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="headerUuid"
        :min-items="1"
        :quick-add-options="headerQuickAddOptions"
        @edit-element="editElement"
      />

      <EditorFormPanel
        v-model="layoutOpen"
        :title="getEditorTranslation('layout-label')"
        data-testid="slider-button-group-title"
      >
        <UiFieldToggle v-model="isStickyToggle" :label="getEditorTranslation('is-sticky-label')" />
      </EditorFormPanel>
    </div>

    <div v-else class="space-y-0">
      <component :is="blockForm" ref="innerFormRef" :uuid="editingBlock.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { Block } from '@plentymarkets/shop-api';

const { headerContainer } = useBlocks();
const { setEditTitle, clearEditTitle } = useBlockEditTitle();
const { logHeaderContainerEditBlock } = useLogEvent();

const innerFormRef = ref<{ exitEditMode?: (shouldEmit?: boolean) => void; isSubEditing?: boolean } | null>(null);

const elementsOpen = ref(true);
const layoutOpen = ref(true);
const { editingBlock, blockForm } = useNestedBlockForm();

const headerContainerStructure = computed(() => (headerContainer.value ?? {}) as HeaderContainerBlock);
const headerUuid = computed(() => headerContainerStructure.value.meta?.uuid);

const isStickyToggle = computed({
  get: () => headerContainerStructure.value.configuration?.layout?.sticky ?? false,
  set: (value: boolean) => {
    if (!headerContainerStructure.value.configuration) {
      headerContainerStructure.value.configuration = { visible: true };
    }
    if (!headerContainerStructure.value.configuration?.layout) {
      headerContainerStructure.value.configuration.layout = {};
    }
    headerContainerStructure.value.configuration.layout.sticky = value;
  },
});

const editElement = (block: Block) => {
  editingBlock.value = block;
  setEditTitle(getBlockDisplayName(block.name), block.meta.uuid);
  logHeaderContainerEditBlock();
};

const exitEditMode = (shouldEmit = true): boolean => {
  if (innerFormRef.value?.isSubEditing && innerFormRef.value?.exitEditMode) {
    innerFormRef.value.exitEditMode(false);
    if (editingBlock.value) {
      setEditTitle(getBlockDisplayName(editingBlock.value.name), editingBlock.value.meta.uuid);
    }
    return false;
  }

  editingBlock.value = null;
  if (shouldEmit) {
    clearEditTitle();
  }
  return true;
};

defineExpose({ exitEditMode });
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
