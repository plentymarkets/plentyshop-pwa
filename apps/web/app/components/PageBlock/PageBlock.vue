<template>
  <div
    v-if="block.meta"
    :key="block.meta.uuid"
    :data-uuid="block.meta.uuid"
    class="h-full"
    @mouseenter="onBlockHover"
    @mouseleave="onBlockUnhover"
  >
    <div
      :id="`block-${index}`"
      :ref="getLazyLoadRef(props.block.name, props.block.meta.uuid)"
      :class="[
        'relative block-wrapper h-full',
        {
          'block-hoverable group/block':
            clientPreview && enableActions && !isTablet && root && !isDragging && !isPopoverTarget,
        },
      ]"
    >
      <div v-if="showOutline && !isDragging" class="pointer-events-none absolute inset-[-6px] block-selected-outline" />
      <ClientOnly>
        <EditorAddBlockButton
          :block="block"
          :index="index"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :root="root"
          :enable-actions="enableActions"
          position="top"
        />
      </ClientOnly>

      <ClientOnly>
        <UiBlockActions
          v-if="enableActions && clientPreview && root && !isDragging"
          :key="`${block.meta.uuid}`"
          :class="[
            'opacity-0',
            {
              'hover:opacity-100 group-hover/block:opacity-100 group-hover/block:translate-y-0': !isTablet,
              '!opacity-100 !translate-y-0': isTablet && isClicked && clickedBlockIndex === index,
            },
          ]"
          :index="index"
          :block="block"
          :read-only="readOnly"
          @change-position="changeBlockPosition"
        />
      </ClientOnly>

      <component :is="getBlockComponent" v-if="getBlockComponent" v-bind="contentProps" :index="index">
        <template v-if="block.type === 'structure'" #content="slotProps">
          <PageBlock
            v-if="shouldShowBlock(slotProps.contentBlock, enableActions)"
            :index="index"
            :block="slotProps.contentBlock"
            :root="false"
            :is-preview="clientPreview"
            :enable-actions="enableActions"
            :is-clicked="isClicked"
            :clicked-block-index="clickedBlockIndex"
            :is-tablet="isTablet"
            :change-block-position="changeBlockPosition"
            :column-length="slotProps.columnLength"
            :is-row-hovered="slotProps.isRowHovered"
            v-bind="slotProps"
          />
        </template>
      </component>

      <ClientOnly>
        <EditorAddBlockButton
          :block="block"
          :index="index"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :root="root"
          :enable-actions="enableActions"
          position="bottom"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PageBlockProps } from './types';

const props = withDefaults(defineProps<PageBlockProps>(), {
  enableActions: false,
  readOnly: false,
});

const viewport = useViewport();
const { isInEditorClient } = useEditorState();
const attrs = useAttrs();
const { isDragging, lazyLoadStates, lazyLoadRefs, shouldLazyLoad, getLazyLoadKey, getLazyLoadConfig, getLazyLoadRef } =
  useBlockManager();
const { popoverState } = useAddBlockPopover();
const { shouldShowBlock } = useBlocksVisibility();
const { blockUuid } = useSiteConfiguration();
const { hoveredUuid, highlightedUuid, setHoveredBlock, clearHoveredBlock } = useTableOfContents();

const clientPreview = computed(() => isInEditorClient.value && viewport.isGreaterOrEquals('lg'));

const getBlockComponent = computed(() => {
  if (!props.block.name) return null;
  return getCachedBlockComponent(props.block.name);
});

const blockIsCurrentlyOpen = computed(() => blockUuid.value === props.block.meta.uuid);

const contentProps = computed(() => {
  const baseProps = props.root ? { ...props.block } : { ...props.block, ...attrs };
  const config = getLazyLoadConfig(props.block.name);

  if (config) {
    const uniqueKey = getLazyLoadKey(props.block.name, props.block.meta.uuid);
    const lazyLoadState = lazyLoadStates.value[uniqueKey] || false || blockIsCurrentlyOpen.value;

    return {
      ...baseProps,
      enableActions: props.enableActions,
      root: props.root,
      [config.propName]: lazyLoadState,
    };
  }

  return {
    ...baseProps,
    enableActions: props.enableActions,
    root: props.root,
  };
});

const observeLazyLoadSection = (blockName: string) => {
  const config = getLazyLoadConfig(blockName);
  const uniqueKey = getLazyLoadKey(blockName, props.block.meta.uuid);

  if (import.meta.client && lazyLoadRefs.value[uniqueKey] && config) {
    const observer = new globalThis.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          lazyLoadStates.value[uniqueKey] = true;
          observer.disconnect();
        }
      },
      {
        threshold: config.threshold || 0,
        rootMargin: config.rootMargin || '0px 0px 250px 0px',
      },
    );
    observer.observe(lazyLoadRefs.value[uniqueKey]!);
  }
};

onNuxtReady(() => {
  if (shouldLazyLoad(props.block.name)) observeLazyLoadSection(props.block.name);
});

const isPopoverTarget = computed(
  () => clientPreview.value && props.enableActions && popoverState.value?.targetUuid === props.block.meta.uuid,
);

const showOutline = computed(() => {
  return (
    (clientPreview.value &&
      props.enableActions &&
      props.isClicked &&
      props.isTablet &&
      props.clickedBlockIndex === props.index) ||
    highlightedUuid.value === props.block.meta.uuid ||
    isPopoverTarget.value
  );
});

const onBlockHover = () => {
  if (props.root) {
    setHoveredBlock(props.block.meta.uuid);
  }
};

const onBlockUnhover = () => {
  if (props.root && hoveredUuid.value === props.block.meta.uuid) {
    clearHoveredBlock();
  }
};
</script>

<style scoped>
.block-hoverable::before,
.block-selected-outline::before {
  content: '';
  position: absolute;
  pointer-events: none;
  border-style: solid;
  @apply border-editor-block-selected;
}

.block-hoverable::before {
  inset: -1px;
  z-index: 30;
  border-width: 3px;
  opacity: 0;
  @apply shadow-block-outline;
}

.block-hoverable:hover::before {
  opacity: 1;
}

.block-selected-outline::before {
  inset: 6px;
  border-width: 4px;
  @apply shadow-block-outline-selected;
}
</style>
