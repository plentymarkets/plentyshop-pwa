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
import type { DragEvent, EditablePageProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');

const { $isPreview } = useNuxtApp();
const props = withDefaults(defineProps<EditablePageProps>(), {
  hasEnabledActions: true,
  preventBlocksRequest: false,
});

const { data, getBlocksServer, cleanData } = useCategoryTemplate(
  props.identifier.toString(),
  props.type.toString(),
  useNuxtApp().$i18n.locale.value,
);
const dataIsEmpty = computed(() => data.value.length === 0);

const isContentEmptyInEditor = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && data.value[0]?.name === 'Footer' && $isPreview),
);

const isContentEmptyInLive = computed(
  () => dataIsEmpty.value || (data.value.length === 1 && data.value[0]?.name === 'Footer'),
);

if (!props.preventBlocksRequest) {
  await getBlocksServer(props.identifier, props.type);
}

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
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { shouldShowBlock, clearRegistry } = useBlocksVisibility();

const enabledActions = computed(
  () => $isPreview && props.hasEnabledActions && disableActions.value && !localizationDrawerOpen.value,
);

onMounted(async () => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);

  if ($isPreview) {
    await import('./draggable.css');
  }
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
