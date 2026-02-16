<template>
  <div>
    <EmptyBlock v-if="isContentEmptyInEditor" />
    <CategoryEmptyState v-else-if="isContentEmptyInLive" />
    <draggable
      v-if="blocksToRender.length"
      v-model="blocksToRender"
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
            :is-last-block="index === blocksToRender.length - 1"
            :change-block-position="changeBlockPosition"
            :root="getBlockDepth(block.meta.uuid) === 0"
            class="group"
            :class="getBlockClass(block).value"
            data-testid="block-wrapper"
            @click="tabletEdit(index)"
          />
        </component>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import type { Block } from '@plentymarkets/shop-api';
import draggable from 'vuedraggable/src/vuedraggable';
import type { DragEvent, EditableBlocksProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');

const { isInEditor, shouldShowEditorUI } = useEditorState();
const props = withDefaults(defineProps<EditableBlocksProps>(), {
  hasEnabledActions: true,
});

const blocksToRender = computed({
  get: () => toValue(props.blocks),
  set: (value: Block[]) => ((props.blocks as Ref<Block[]>).value = value),
});

const isContentEmpty = computed(() => blocksToRender.value.length === 0);
const isContentEmptyInEditor = computed(() => isContentEmpty.value);
const isContentEmptyInLive = computed(() => isContentEmpty.value);

const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  tabletEdit,
  changeBlockPosition,
  handleDragStart,
  handleDragEnd,
  getBlockDepth,
} = useBlockManager();

const scrollToBlock = (evt: DragEvent) => {
  if (!evt.moved) return;

  const { newIndex } = evt.moved;
  const block = document.getElementById(`block-${newIndex}`);

  if (block) nextTick(() => block.scrollIntoView({ behavior: 'smooth', block: 'start' }));
};

const { closeDrawer } = useSiteConfiguration();
const { settingsIsDirty } = useSiteSettings();
const { isEditingEnabled } = useEditor();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { shouldShowBlock, clearRegistry, isHydrationComplete } = useBlocksVisibility();

const enabledActions = computed(() => {
  const enabled = shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value;
  return enabled;
});

onMounted(async () => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);

  if (isInEditor.value) await import('./draggable.css');

  isHydrationComplete.value = true;
});

onBeforeUnmount(() => {
  clearRegistry();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const hasUnsavedChanges = () => isEditingEnabled.value || settingsIsDirty.value;
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!hasUnsavedChanges()) return;
  event.preventDefault();
};
</script>
