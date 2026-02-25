<template>
  <div>
    <EmptyBlock v-if="!minimal && isContentEmptyInEditor" />
    <CategoryEmptyState v-else-if="!minimal && isContentEmptyInLive" />
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
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable/src/vuedraggable';
import type { DragEvent, EditableBlocksProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');

const { isInEditor, shouldShowEditorUI } = useEditorState();
const props = withDefaults(defineProps<EditableBlocksProps>(), {
  identifier: 'index',
  type: 'immutable',
  hasEnabledActions: true,
  preventBlocksRequest: false,
  minimal: false,
  blocks: () => [],
});

const {
  data: templateData,
  getBlocksServer,
  cleanData,
  isFooterBlock,
  footerCache,
  addFooterBlock,
} = useCategoryTemplate(props.identifier.toString(), props.type.toString(), useNuxtApp().$i18n.locale.value);

// Use blocks prop if provided, otherwise use templateData
const data = computed(() => (props.blocks && props.blocks.length > 0 ? props.blocks : templateData.value));

const dataIsEmpty = computed(() => data.value.length === 0);

const isContentEmptyInEditor = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && isFooterBlock(data.value[0]) && isInEditor.value),
);

const isContentEmptyInLive = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && isFooterBlock(data.value[0])),
);

if (!props.preventBlocksRequest && !props.minimal && (!props.blocks || props.blocks.length === 0)) {
  await getBlocksServer(props.identifier, props.type);
}

if (!props.blocks || props.blocks.length === 0) {
  addFooterBlock({
    data: templateData,
    cachedFooter: footerCache,
    cleanData,
  });
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
} = useBlockManager();

const scrollToBlock = (evt: DragEvent) => {
  const footerIndex = data.value.findIndex((block) => isFooterBlock(block));
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
const { settingsIsDirty } = useSiteSettings();
const { isEditingEnabled } = useEditor();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { shouldShowBlock, clearRegistry, isHydrationComplete } = useBlocksVisibility();

const enabledActions = computed(
  () => !props.minimal && shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
);

onMounted(async () => {
  if (!props.minimal) {
    isEditingEnabled.value = false;
    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  if (isInEditor.value && !props.minimal) {
    await import('./draggable.css');
  }

  isHydrationComplete.value = true;
});

onBeforeUnmount(() => {
  clearRegistry();
  if (!props.minimal) {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }
});

const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) return;
  event.preventDefault();
};

if (!props.minimal) {
  onBeforeRouteLeave((to, from, next) => {
    if (isEditingEnabled.value) {
      const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmation) {
        closeDrawer();
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  });
}
</script>
