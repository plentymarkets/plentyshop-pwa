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
      <div
        v-if="showOutline && !isDragging"
        class="pointer-events-none absolute inset-[-6px] z-modal-backdrop block-selected-outline"
      />
      <ClientOnly>
        <button
          v-if="showTopAddBlockButton"
          :class="[
            addBlockButtonBase,
            'top-0 -translate-y-1/2',
            'group-hover/block:opacity-100 group-hover/block:scale-100 focus-visible:opacity-100 focus-visible:scale-100',
            {
              '!opacity-100 !scale-100':
                (isClicked && clickedBlockIndex === index) || (isPopoverTarget && popoverState?.position === 'top'),
              '!z-modal': isPopoverTarget && popoverState?.position === 'top',
            },
          ]"
          data-testid="top-add-block"
          aria-label="top add block"
          @click.stop="addNewBlock(block, 'top', $event)"
        >
          <SfTooltip class="flex" :label="buttonLabel" placement="top" :show-arrow="true">
            <SfIconAdd class="cursor-pointer" size="xs" />
          </SfTooltip>
        </button>
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
        <button
          v-if="showBottomAddBlockButton"
          :key="isDragging ? 'dragging' : 'not-dragging'"
          :class="[
            addBlockButtonBase,
            'bottom-0 translate-y-1/2',
            'group-hover/block:opacity-100 group-hover/block:scale-100',
            {
              '!opacity-100 !scale-100':
                (isClicked && clickedBlockIndex === index) || (isPopoverTarget && popoverState?.position === 'bottom'),
              '!z-modal': isPopoverTarget && popoverState?.position === 'bottom',
            },
          ]"
          data-testid="bottom-add-block"
          aria-label="bottom add block"
          @click.stop="addNewBlock(block, 'bottom', $event)"
        >
          <SfTooltip class="flex" :label="buttonLabel" placement="bottom" :show-arrow="true">
            <SfIconAdd class="cursor-pointer" size="xs" />
          </SfTooltip>
        </button>
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfIconAdd, SfTooltip } from '@storefront-ui/vue';
import type { BlockPosition } from '~/composables/useBlockManager/types';
import type { PageBlockProps } from './types';
import type { Block } from '@plentymarkets/shop-api';

const props = withDefaults(defineProps<PageBlockProps>(), {
  enableActions: false,
  readOnly: false,
});

const viewport = useViewport();
const { isInEditorClient } = useEditorState();
const attrs = useAttrs();
const { isDragging, lazyLoadStates, lazyLoadRefs, shouldLazyLoad, getLazyLoadKey, getLazyLoadConfig, getLazyLoadRef } =
  useBlockManager();
const { openAddBlockPopover, popoverState } = useAddBlockPopover();
const { shouldShowBlock } = useBlocksVisibility();
const { blockUuid } = useSiteConfiguration();
const { hoveredUuid, highlightedUuid, setHoveredBlock, clearHoveredBlock } = useTableOfContents();
const { logContentCreateBlock } = useLogEvent();

const clientPreview = computed(() => isInEditorClient.value && viewport.isGreaterOrEquals('lg'));
const buttonLabel = 'Insert a new block at this position.';

const addBlockButtonBase = [
  'add-block-button no-drag',
  'absolute left-1/2 -translate-x-1/2 z-base @md:z-raised @lg:z-editor-inline',
  'flex items-center justify-center w-7 h-7 rounded-full p-0 border-0',
  'bg-editor-block-selected text-white shadow-add-block-btn',
  'opacity-0 scale-90',
  'transition-[opacity,transform,box-shadow,background-color] duration-200 ease-editor-out',
  'hover:bg-editor-block-selected-hover hover:scale-110 hover:shadow-add-block-btn-hover',
].join(' ');

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

const addNewBlock = (block: Block, position: BlockPosition, event: MouseEvent) => {
  if (useRuntimeConfig().public.enableAddBlockPopover) {
    openAddBlockPopover({ anchorEl: event.currentTarget as HTMLElement, targetUuid: block.meta.uuid, position });
  } else {
    const { openDrawerWithView } = useSiteConfiguration();
    const { togglePlaceholder } = useBlockManager();
    const { clearInsertColumnUuid } = useBlocksMutations();
    togglePlaceholder(block.meta.uuid, position);
    openDrawerWithView('blocksList');
    clearInsertColumnUuid();
  }
  logContentCreateBlock();
};

const showTopAddBlockButton = computed(
  () =>
    props.enableActions &&
    clientPreview.value &&
    props.root &&
    !isDragging.value &&
    !isHeaderContainerBlock(props.block),
);

const showBottomAddBlockButton = computed(
  () =>
    props.enableActions &&
    clientPreview.value &&
    !isDragging.value &&
    !isFooterContainerBlock(props.block) &&
    props.root,
);

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
