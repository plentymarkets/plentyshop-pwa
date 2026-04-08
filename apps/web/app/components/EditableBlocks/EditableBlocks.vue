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
              root
              :read-only="readOnly"
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
  isRoot: false,
  hasEnabledActions: true,
  preventBlocksRequest: false,
  readOnly: false,
  blocks: () => [],
});

const { data: allBlocks, pageBlocks, fetchBlocks } = useBlocks();

const frozenBlocks = shallowRef<Block[] | null>(null);

onBeforeRouteUpdate(() => {
  if (!frozenBlocks.value) {
    frozenBlocks.value = pageBlocks.value;
  }
});

onBeforeRouteLeave(() => {
  if (!frozenBlocks.value) {
    frozenBlocks.value = pageBlocks.value;
  }
});

const rawData = computed(() => (props.blocks && props.blocks.length > 0 ? props.blocks : allBlocks.value));

const data = computed({
  get: () => {
    if (frozenBlocks.value) {
      return frozenBlocks.value;
    }
   return  props.blocks && props.blocks.length > 0 ? props.blocks : pageBlocks.value;
  },
  set: (newValue: Block[]) => {},
});

const getRawIndex = (block: Block) => rawData.value.indexOf(block);

const dataIsEmpty = computed(() => data.value.length === 0);

const isContentEmptyInEditor = computed(() => dataIsEmpty.value && isInEditor.value);

const isContentEmptyInLive = computed(() => dataIsEmpty.value);

if (!props.preventBlocksRequest && !props.readOnly && (!props.blocks || props.blocks.length === 0)) {
  await fetchBlocks(props.identifier, props.type);
  if (frozenBlocks.value) {
    frozenBlocks.value = null;
  }
}

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
const { shouldShowBlock, clearRegistry, isHydrationComplete } = useBlocksVisibility();

const drawerOpen = computed<boolean>(() => siteConfigurationDrawerOpenRef.value);
const drawerView = computed<string | null>(() => siteConfigurationDrawerViewRef.value);

const enabledActions = computed(
  () => shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
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
