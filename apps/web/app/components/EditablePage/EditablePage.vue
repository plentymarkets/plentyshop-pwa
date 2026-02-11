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
import type { DragEvent, EditablePageProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');

const { isInEditor, shouldShowEditorUI } = useEditorState();
const props = withDefaults(defineProps<EditablePageProps>(), {
  area: 'all',
  hasEnabledActions: true,
  preventBlocksRequest: false,
});

console.warn(
  '[EDITABLE_PAGE]',
  props.area,
  'identifier:',
  props.identifier,
  'type:',
  typeof props.identifier,
  'prevent:',
  props.preventBlocksRequest,
);

const { data, headerBlocks, mainBlocks, footerBlocks, getBlocksServer } = useCategoryTemplate(
  props.identifier.toString(),
  props.type.toString(),
  useNuxtApp().$i18n.locale.value,
);

const stateKey = `useCategoryTemplate-${props.identifier.toString()}-${props.type.toString()}-${useNuxtApp().$i18n.locale.value}-all`;
console.warn('[EDITABLE_PAGE]', props.area, 'State key:', stateKey);
console.warn('[EDITABLE_PAGE]', props.area, 'data.length:', data.value.length);

// Select blocks based on area prop - writable computed for draggable v-model
const blocksToRender = computed({
  get: () => {
    let result;
    switch (props.area) {
      case 'header':
        result = headerBlocks.value;
        break;
      case 'main':
        result = mainBlocks.value;
        break;
      case 'footer':
        result = footerBlocks.value;
        break;
      default:
        result = data.value;
    }
    console.warn(
      '[EDITABLE_PAGE]',
      props.area,
      'blocksToRender.length:',
      result.length,
      'names:',
      result.map((b) => b.name),
    );
    return result;
  },
  set: (value) => {
    // Update the main data array based on which area is being edited
    // This ensures drag-and-drop changes are persisted correctly
    switch (props.area) {
      case 'header':
      case 'main':
      case 'footer': {
        // For specific areas, we need to reconstruct the full data array
        const otherBlocks = data.value.filter((block) => {
          if (props.area === 'header') return block.name !== 'Header';
          if (props.area === 'footer') return block.name !== 'Footer';
          return block.name === 'Header' || block.name === 'Footer';
        });

        // Reconstruct array with proper order: Header -> Main -> Footer
        const newData: Block[] = [];
        if (props.area === 'header') {
          newData.push(...value);
          newData.push(...otherBlocks.filter((b) => b.name !== 'Footer'));
          newData.push(...otherBlocks.filter((b) => b.name === 'Footer'));
        } else if (props.area === 'footer') {
          newData.push(...otherBlocks.filter((b) => b.name === 'Header'));
          newData.push(...otherBlocks.filter((b) => b.name !== 'Header' && b.name !== 'Footer'));
          newData.push(...value);
        } else {
          // main area
          newData.push(...otherBlocks.filter((b) => b.name === 'Header'));
          newData.push(...value);
          newData.push(...otherBlocks.filter((b) => b.name === 'Footer'));
        }

        data.value.splice(0, data.value.length, ...newData);
        break;
      }
      default:
        // For 'all', just replace everything
        data.value.splice(0, data.value.length, ...value);
    }
  },
});

const dataIsEmpty = computed(() => blocksToRender.value.length === 0);

// Don't show empty state when preventBlocksRequest is true - parent is responsible for data
const isContentEmptyInEditor = computed(() => dataIsEmpty.value && !props.preventBlocksRequest);
const isContentEmptyInLive = computed(() => dataIsEmpty.value && !props.preventBlocksRequest);

if (!props.preventBlocksRequest) {
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
} = useBlockManager();

const scrollToBlock = (evt: DragEvent) => {
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
  () => shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
);

onMounted(async () => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);

  if (isInEditor.value) {
    await import('./draggable.css');
  }

  isHydrationComplete.value = true;
});

onBeforeUnmount(() => {
  clearRegistry();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) return;
  event.preventDefault();
};

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
</script>
