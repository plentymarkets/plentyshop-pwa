<template>
  <div>
    <EmptyBlock v-if="isContentEmptyInEditor" />
    <CategoryEmptyState v-else-if="isContentEmptyInLive" />
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
        >
          <PageBlock
            :index="index"
            :block="block"
            :enable-actions="enabledActions"
            :is-clicked="isClicked"
            :clicked-block-index="clickedBlockIndex"
            :is-tablet="isTablet"
            :block-has-data="blockHasData"
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
import type { DragEvent, EditablePageProps } from './types';
import type { Block } from '@plentymarkets/shop-api';

const NarrowContainer = resolveComponent('NarrowContainer');

const { $isPreview } = useNuxtApp();
const props = withDefaults(defineProps<EditablePageProps>(), {
  hasEnabledActions: true,
});

definePageMeta({
  identifier: props.identifier,
});

const { data, getBlocksServer, cleanData } = useCategoryTemplate();
const dataIsEmpty = computed(() => data.value.length === 0);

const isContentEmptyInEditor = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && data.value[0]?.name === 'Footer' && $isPreview),
);

const isContentEmptyInLive = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && data.value[0]?.name === 'Footer'),
);

await getBlocksServer(props.identifier, props.type);

const { footerCache } = useFooter();
addFooterBlock({
  data,
  cachedFooter: footerCache,
  cleanData,
});

const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  blockHasData,
  tabletEdit,
  changeBlockPosition,
  handleDragStart,
  handleDragEnd,
  getBlockDepth,
} = useBlockManager();

const scrollToBlock = (evt: DragEvent) => {
  const footerIndex = data.value.findIndex((block) => block.name === 'Footer');
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
const { isEditingEnabled, disableActions } = useEditor();

const enabledActions = computed(() => props.hasEnabledActions && disableActions.value);

onMounted(() => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onMounted(async () => {
  if ($isPreview) {
    await import('./draggable.css');
  }
});

onBeforeUnmount(() => {
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

const containerExcludedBlockSet = new Set(['Banner', 'Carousel', 'Footer', 'MultiGrid', 'CategoryData']);
const paddingExcludedBlockSet = new Set([
  'Banner',
  'Carousel',
  'NewsletterSubscribe',
  'Footer',
  'MultiGrid',
  'CategoryData',
]);

const isExcluded = (blockName: string, excludedSet: Set<string>) => {
  return excludedSet.has(blockName);
};

const getBlockClass = (block: Block) =>
  computed(() => ({
    'max-w-screen-3xl mx-auto mt-3': !isExcluded(block.name, containerExcludedBlockSet),
    'px-4 md:px-6': !isExcluded(block.name, paddingExcludedBlockSet),
  }));
</script>
