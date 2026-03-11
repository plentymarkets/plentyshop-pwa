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
      <template #item="{ element: block, index }">
        <div>
          <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(block.meta.uuid, 'top', drawerOpen, drawerView)" />
          <component
            :is="block?.content?.layout?.narrowContainer || block?.layout?.narrowContainer ? NarrowContainer : 'div'"
            v-if="shouldShowBlock(block, enabledActions)"
          >
            <PageBlock
              :index="index"
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
              @click="tabletEdit(index)"
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
  getBlocksServer,
  isFooterBlock,
} = useBlockTemplates(props.identifier.toString(), props.type.toString(), useNuxtApp().$i18n.locale.value);

const localBlocks = ref<Block[]>(props.blocks ? JSON.parse(JSON.stringify(props.blocks)) : []);

const data = computed({
  get: () => {
    if (props.blocks && props.blocks.length > 0) {
      return localBlocks.value;
    }
    return templateData.value;
  },
  set: (newValue) => {
    if (props.blocks && props.blocks.length > 0) {
      localBlocks.value.splice(0, localBlocks.value.length, ...newValue);
    } else {
      templateData.value.splice(0, templateData.value.length, ...newValue);
    }
  },
});

watch(
  () => props.blocks,
  (newBlocks) => {
    if (newBlocks && newBlocks.length > 0) {
      localBlocks.value = JSON.parse(JSON.stringify(newBlocks));
    }
  },
  { deep: true },
);

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
  const footerIndex = data.value.findIndex((block: Block) => isFooterBlock(block));
  const lastIndex = data.value.length - 1;
  if (footerIndex !== -1 && footerIndex !== lastIndex) {
    const footerBlock = data.value.splice(footerIndex, 1)[0];
    if (footerBlock) {
      data.value.push(footerBlock);
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

const { closeDrawer } = useSiteConfiguration();
const { drawerOpen, drawerView } = useSiteConfiguration();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { shouldShowBlock, clearRegistry, isHydrationComplete } = useBlocksVisibility();


const enabledActions = computed(
  () => !props.readOnly && shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
);

useEditorUnsavedChangesGuard({
  enabled: !props.readOnly,
  onConfirmLeave: () => closeDrawer(),
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
