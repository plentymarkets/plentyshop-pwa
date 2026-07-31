<template>
  <div data-testid="header-container-form" class="block-header-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="!editingBlock" class="space-y-0">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="headerUuid"
        :min-items="1"
        :quick-add-options="headerQuickAddOptions"
        :can-move="guardHeaderMove"
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
      <component :is="blockForm" :uuid="editingBlock.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';
import type { Block } from '@plentymarkets/shop-api';

const { headerContainer } = useBlocks();
const { logHeaderContainerEditBlock } = useLogEvent();

const elementsOpen = ref(true);
const layoutOpen = ref(true);

const headerContainerStructure = computed(() => (headerContainer.value ?? {}) as HeaderContainerBlock);
const headerUuid = computed(() => headerContainerStructure.value.meta?.uuid);
const { editingBlock, blockForm } = useNestedBlockForm(headerUuid);
const { pushEdit } = useBlockEditStack();

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
  pushEdit(block);
  logHeaderContainerEditBlock();
};

const guardHeaderMove = (evt: BlockMoveEvent) =>
  canMoveHeaderBlock(
    Array.isArray(headerContainerStructure.value.content) ? headerContainerStructure.value.content : [],
    evt,
  );
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
