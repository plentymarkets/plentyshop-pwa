<template>
  <div>
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
              :index="getIndex(block)"
              :block="block"
              :enable-actions="enabledActions"
              :is-clicked="isClicked"
              :clicked-block-index="clickedBlockIndex"
              :is-tablet="isTablet"
              :change-block-position="changeBlockPosition"
              root
              :read-only="readOnly"
              class="group"
              :class="getBlockClass(block).value"
              data-testid="block-wrapper"
              @click="tabletEdit(getIndex(block))"
            />
          </component>
          <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(block.meta.uuid, 'bottom', drawerOpen, drawerView)" />
        </div>
      </template>
    </draggable>
    <CategoryEmptyState v-else-if="!readOnly && isContentEmptyInLive" />
    <EmptyBlock v-else />
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable/src/vuedraggable';
import type { Block } from '@plentymarkets/shop-api';
import type { DragEvent, EditableBlocksProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');

const { isLiveMode, shouldShowEditorUI } = useEditorState();
const props = withDefaults(defineProps<EditableBlocksProps>(), {
  identifier: 'index',
  type: 'immutable',
  isRoot: false,
  hasEnabledActions: true,
  preventBlocksRequest: false,
  readOnly: false,
  blocks: () => [],
});

const { pageBlocks, updateBlocks } = useBlocks();

const frozenBlocks = shallowRef<Block[] | null>(null);

const renderedBlocks = computed(() => {
  return props.blocks && props.blocks.length > 0 ? props.blocks : pageBlocks.value;
});

if (import.meta.client) {
  onBeforeRouteUpdate(() => {
    if (!frozenBlocks.value) {
      frozenBlocks.value = renderedBlocks.value;
    }
  });

  onBeforeRouteLeave(() => {
    if (!frozenBlocks.value) {
      frozenBlocks.value = renderedBlocks.value;
    }
  });
}

const data = computed({
  get() {
    if (frozenBlocks.value) {
      return frozenBlocks.value;
    }
    return renderedBlocks.value;
  },
  set(value: Block[]) {
    updateBlocks(value);
  },
});

const getIndex = (block: Block) => renderedBlocks.value.indexOf(block);

const isContentEmptyInLive = computed(() => data.value.length === 0 && isLiveMode.value);

const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  tabletEdit,
  changeBlockPosition,
  handleDragStart,
  handleDragEnd,
  shouldDisplayPlaceholder,
} = useBlockManager();

const scrollToBlock = (evt: DragEvent) => {
  const footerIndex = pageBlocks.value.findIndex((block: Block) => isFooterBlock(block));
  const lastIndex = pageBlocks.value.length - 1;
  if (footerIndex !== -1 && footerIndex !== lastIndex) {
    const footerBlock = pageBlocks.value.splice(footerIndex, 1)[0];
    if (footerBlock) {
      pageBlocks.value.push(footerBlock);
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
const { shouldShowBlock, clearRegistry } = useBlocksVisibility();

const drawerOpen = computed<boolean>(() => siteConfigurationDrawerOpenRef.value);
const drawerView = computed<string | null>(() => siteConfigurationDrawerViewRef.value);

const enabledActions = computed(
  () => shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
);

useEditorUnsavedChangesGuard({
  enabled: !props.readOnly,
  onConfirmLeave: () => closeSiteConfigurationDrawer(),
});

onBeforeUnmount(() => {
  clearRegistry();
});
</script>
