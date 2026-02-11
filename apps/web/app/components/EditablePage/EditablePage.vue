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
import type { BlockArea, DragEvent, EditablePageProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');

const { isInEditor, shouldShowEditorUI } = useEditorState();
const props = withDefaults(defineProps<EditablePageProps>(), {
  area: 'all',
  hasEnabledActions: true,
  preventBlocksRequest: false,
});

const { data, headerBlocks, mainBlocks, footerBlocks, getBlocksServer } = useCategoryTemplate(
  props.identifier.toString(),
  props.type.toString(),
  useNuxtApp().$i18n.locale.value,
);

const getBlocksByArea = (area: BlockArea = 'all'): Block[] => {
  const areaBlocksMap: Record<BlockArea, Block[]> = {
    header: headerBlocks.value,
    main: mainBlocks.value,
    footer: footerBlocks.value,
    all: data.value,
  };

  return areaBlocksMap[area];
};

const partitionBlocks = (blocks: Block[]) => ({
  header: blocks.filter((b) => b.name === 'Header'),
  main: blocks.filter((b) => b.name !== 'Header' && b.name !== 'Footer'),
  footer: blocks.filter((b) => b.name === 'Footer'),
});

const setBlocksByArea = (area: BlockArea = 'all', value: Block[]) => {
  if (area === 'all') {
    data.value.splice(0, data.value.length, ...value);
    return;
  }

  const { header, main, footer } = partitionBlocks(data.value);

  const areaOrderMap: Record<Exclude<BlockArea, 'all'>, Block[][]> = {
    header: [value, main, footer],
    main: [header, value, footer],
    footer: [header, main, value],
  };

  const newData = areaOrderMap[area as Exclude<BlockArea, 'all'>].flat();
  data.value.splice(0, data.value.length, ...newData);
};

const blocksToRender = computed({
  get: () => getBlocksByArea(props.area),
  set: (value) => setBlocksByArea(props.area, value),
});

const isContentEmpty = computed(() => blocksToRender.value.length === 0 && !props.preventBlocksRequest);
const isContentEmptyInEditor = computed(() => isContentEmpty.value);
const isContentEmptyInLive = computed(() => isContentEmpty.value);

if (!props.preventBlocksRequest) await getBlocksServer(props.identifier, props.type);

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

const enabledActions = computed(
  () => shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
);

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

onBeforeRouteLeave((to, from, next) => {
  if (!isEditingEnabled.value) {
    next();
    return;
  }

  const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');

  if (confirmation) {
    closeDrawer();
    next();
  } else {
    next(false);
  }
});
</script>
