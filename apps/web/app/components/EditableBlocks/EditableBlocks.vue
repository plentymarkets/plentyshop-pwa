<template>
  <div>
    <EmptyBlock v-if="!readOnly && isContentEmptyInEditor" />
    <CategoryEmptyState v-else-if="!readOnly && isContentEmptyInLive" />
    <draggable
      v-if="data.length"
      v-model="data"
      item-key="meta.uuid"
      handle=".drag-handle"
      class="content"
      :filter="'.no-drag'"
      :prevent-on-filter="false"
      @change="scrollToBlock"
      @start="handleDragStart"
      @end="handleDragEnd"
    >
      <template #item="{ element: block }">
        <div>
          <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(block.meta.uuid, 'top', drawerOpen, drawerView)" />
          <component
            :is="block?.content?.layout?.narrowContainer || block?.layout?.narrowContainer ? NarrowContainer : 'div'"
            v-if="shouldShowBlock(block, enabledActions)"
          >
            <PageBlock
              :index="getRawIndex(block)"
              :block="block"
              :enable-actions="enabledActions"
              :is-clicked="isClicked"
              :clicked-block-index="clickedBlockIndex"
              :is-tablet="isTablet"
              :change-block-position="changeBlockPosition"
              :root="getBlockDepth(block.meta.uuid) === 0"
              class="group"
              :class="getBlockClass(block).value"
              data-testid="block-wrapper"
              @click="tabletEdit(getRawIndex(block))"
            />
          </component>
          <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(block.meta.uuid, 'bottom', drawerOpen, drawerView)" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable/src/vuedraggable';
import type { Block } from '@plentymarkets/shop-api';
import type { DragEvent, EditableBlocksProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');

const { isInEditor, shouldShowEditorUI } = useEditorState();
const props = withDefaults(defineProps<EditableBlocksProps>(), {
  identifier: 'index',
  type: 'immutable',
  hasEnabledActions: true,
  preventBlocksRequest: false,
  readOnly: false,
  blocks: () => [],
});

const {
  data: templateData,
  renderableBlocks,
  getBlocksServer,
  isFooterBlock,
} = useBlockTemplates(props.identifier.toString(), props.type.toString(), useNuxtApp().$i18n.locale.value);

const rawData = computed(() => (props.blocks && props.blocks.length > 0 ? props.blocks : templateData.value));

const data = computed({
  get: () => (props.blocks && props.blocks.length > 0 ? props.blocks : renderableBlocks.value),
  set: (newValue: Block[]) => {
    const target = props.blocks && props.blocks.length > 0 ? props.blocks : templateData.value;
    const header = target.find((block) => isHeaderContainerBlock(block));
    const rebuilt = header ? [header, ...newValue] : newValue;
    target.splice(0, target.length, ...rebuilt);
  },
});

const getRawIndex = (block: Block) => rawData.value.indexOf(block);

const dataIsEmpty = computed(() => data.value.length === 0);

const isContentEmptyInEditor = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && isFooterBlock(data.value[0]) && isInEditor.value),
);

const isContentEmptyInLive = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && isFooterBlock(data.value[0])),
);

if (!props.preventBlocksRequest && !props.readOnly && (!props.blocks || props.blocks.length === 0)) {
  await getBlocksServer(props.identifier, props.type);
}

const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  tabletEdit,
  changeBlockPosition,
  handleDragStart,
  handleDragEnd,
  getBlockDepth,
  shouldDisplayPlaceholder,
} = useBlockManager();

const scrollToBlock = (evt: DragEvent) => {
  const footerIndex = templateData.value.findIndex((block: Block) => isFooterBlock(block));
  const lastIndex = templateData.value.length - 1;
  if (footerIndex !== -1 && footerIndex !== lastIndex) {
    const footerBlock = templateData.value.splice(footerIndex, 1)[0];
    if (footerBlock) {
      templateData.value.push(footerBlock);
    }
  }

  if (evt.moved) {
    const { newIndex } = evt.moved;
    const block = document.getElementById(`block-${newIndex}`);
    if (block) {
      nextTick(() => {
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
};

const {
  closeSiteConfigurationDrawer,
  siteConfigurationDrawerOpen: siteConfigurationDrawerOpenRef,
  siteConfigurationDrawerView: siteConfigurationDrawerViewRef,
} = useSiteConfiguration();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { shouldShowBlock, clearRegistry, isHydrationComplete } = useBlocksVisibility();

const drawerOpen = computed<boolean>(() => siteConfigurationDrawerOpenRef.value);
const drawerView = computed<string | null>(() => siteConfigurationDrawerViewRef.value);

const enabledActions = computed(
  () => !props.readOnly && shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
);

useEditorUnsavedChangesGuard({
  enabled: !props.readOnly,
  onConfirmLeave: () => closeSiteConfigurationDrawer(),
});

onMounted(async () => {
  if (!props.readOnly) {
    const { isEditingEnabled } = useEditor();
    isEditingEnabled.value = false;
  }

  if (isInEditor.value && !props.readOnly) {
    await import('./draggable.css');
  }

  isHydrationComplete.value = true;
});

onBeforeUnmount(() => {
  clearRegistry();
});
</script>
