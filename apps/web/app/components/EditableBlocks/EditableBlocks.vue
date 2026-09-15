<template>
  <div>
    <template v-if="data.length">
      <component
        :is="draggableComp"
        v-if="enabledActions && draggableComp"
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
            <component
              :is="isNarrowContainer(block) ? NarrowContainer : 'div'"
              v-if="shouldShowBlock(block, enabledActions)"
            >
              <component
                :is="pageBlockComponent"
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
          </div>
        </template>
      </component>
      <div v-else class="content">
        <div v-for="block in data" :key="block.meta.uuid">
          <component
            :is="isNarrowContainer(block) ? NarrowContainer : 'div'"
            v-if="shouldShowBlock(block, enabledActions)"
          >
            <component
              :is="pageBlockComponent"
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
        </div>
      </div>
    </template>
    <CategoryEmptyState v-else-if="!readOnly && isContentEmptyInLive" />
    <EmptyBlock v-else />
  </div>
</template>

<script lang="ts" setup>
import type { ConcreteComponent } from 'vue';
import type { Block } from '@plentymarkets/shop-api';
import type { BlockWithLayout, DragEvent, EditableBlocksProps } from './types';

const NarrowContainer = resolveComponent('NarrowContainer');
const PageBlock = resolveComponent('PageBlock');
const EditorPageBlock = defineAsyncComponent(() => import('../EditorPageBlock/EditorPageBlock.vue'));

const isNarrowContainer = (block: Block) => {
  const layoutBlock = block as BlockWithLayout;
  return layoutBlock.content?.layout?.narrowContainer || layoutBlock.layout?.narrowContainer;
};

const draggableComp = shallowRef<ConcreteComponent | null>(null);

const { isLiveMode, shouldShowEditorUI } = useEditorState();
const props = withDefaults(defineProps<EditableBlocksProps>(), {
  identifier: HOMEPAGE_IDENTIFIER,
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

const { isClicked, clickedBlockIndex, isTablet, tabletEdit, changeBlockPosition, handleDragStart, handleDragEnd } =
  useBlockManager();

const scrollToBlock = (evt: DragEvent) => {
  const footerIndex = pageBlocks.value.findIndex((block: Block) => isFooterContainerBlock(block));
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

const { closeSiteConfigurationDrawer } = useSiteConfiguration();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { shouldShowBlock, clearRegistry, isHydrationComplete } = useBlocksVisibility();

const enabledActions = computed(
  () => shouldShowEditorUI.value && props.hasEnabledActions && !localizationDrawerOpen.value,
);
const pageBlockComponent = computed(() => (shouldShowEditorUI.value ? EditorPageBlock : PageBlock));

const loadDraggable = async () => {
  const [mod] = await Promise.all([import('vuedraggable/src/vuedraggable'), import('./draggable.css')]);
  draggableComp.value = mod.default as ConcreteComponent;
};

watch(
  enabledActions,
  (val) => {
    if (val && !draggableComp.value) {
      loadDraggable();
    }
  },
  { immediate: true },
);

useEditorUnsavedChangesGuard({
  enabled: !props.readOnly,
  onConfirmLeave: () => closeSiteConfigurationDrawer(),
});

onMounted(() => {
  isHydrationComplete.value = true;
});

onBeforeUnmount(() => {
  clearRegistry();
});
</script>
