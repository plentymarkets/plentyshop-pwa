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
        'relative block-wrapper h-full block-hover-target',
        {
          'block-hoverable': clientPreview && enableActions && !isTablet && root && !isDragging && !isPopoverTarget,
        },
      ]"
    >
      <div
        v-if="showOutline && !isDragging"
        class="pointer-events-none absolute inset-0 z-[200] block-selected-outline"
      />
      <ClientOnly>
        <button
          v-if="showTopAddBlockButton"
          class="add-block-button add-block-button--premium add-block-button--top no-drag z-[0] md:z-[1] lg:z-[40] absolute top-0 left-1/2"
          :class="[
            {
              'add-block-button--active':
                (isClicked && clickedBlockIndex === index) || (isPopoverTarget && popoverState?.position === 'top'),
              '!z-[201]': isPopoverTarget && popoverState?.position === 'top',
            },
          ]"
          data-testid="top-add-block"
          aria-label="top add block"
          @click.stop="addNewBlock(block, 'top', $event)"
        >
          <SfTooltip :label="buttonLabel" placement="top" :show-arrow="true">
            <SfIconAdd class="cursor-pointer" size="xs" />
          </SfTooltip>
        </button>
      </ClientOnly>

      <ClientOnly>
        <UiBlockActions
          v-if="enableActions && clientPreview && root && !isDragging"
          :key="`${block.meta.uuid}`"
          :class="[
            'opacity-0 block-actions',
            {
              'hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100': !isTablet,
              'opacity-100': isTablet && isClicked && clickedBlockIndex === index,
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
          class="add-block-button add-block-button--premium add-block-button--bottom no-drag z-[0] md:z-[1] lg:z-[40] absolute bottom-0 left-1/2"
          :class="[
            {
              'add-block-button--active':
                (isClicked && clickedBlockIndex === index) || (isPopoverTarget && popoverState?.position === 'bottom'),
              '!z-[201]': isPopoverTarget && popoverState?.position === 'bottom',
            },
          ]"
          data-testid="bottom-add-block"
          aria-label="bottom add block"
          @click.stop="addNewBlock(block, 'bottom', $event)"
        >
          <SfTooltip :label="buttonLabel" placement="bottom" :show-arrow="true">
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
.block-hoverable {
  transition: box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.block-hoverable:hover {
  box-shadow:
    0 0 0 1.5px rgba(29, 94, 199, 0.55),
    0 14px 32px -10px rgba(29, 94, 199, 0.24),
    0 4px 12px -4px rgba(15, 23, 42, 0.06);
}

.block-selected-outline {
  box-shadow:
    0 0 0 2px #1d5ec7,
    0 22px 44px -10px rgba(29, 94, 199, 0.4),
    0 10px 22px -6px rgba(29, 94, 199, 0.2);
  animation: blockSelectFade 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes blockSelectFade {
  from {
    box-shadow:
      0 0 0 0 rgba(29, 94, 199, 0),
      0 0 0 rgba(29, 94, 199, 0),
      0 0 0 rgba(29, 94, 199, 0);
  }
  to {
    box-shadow:
      0 0 0 2px #1d5ec7,
      0 22px 44px -10px rgba(29, 94, 199, 0.4),
      0 10px 22px -6px rgba(29, 94, 199, 0.2);
  }
}

.add-block-button--premium {
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: #1d5ec7;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  opacity: 0;
  box-shadow: 0 2px 8px rgba(29, 94, 199, 0.3);
  transition:
    opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    background-color 180ms ease,
    box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.add-block-button--top {
  transform: translate(-50%, -50%) scale(0.85);
}

.add-block-button--bottom {
  transform: translate(-50%, 50%) scale(0.85);
}

.group:hover .add-block-button--top,
.group:focus-within .add-block-button--top,
.add-block-button--top:hover,
.add-block-button--top:focus-visible,
.add-block-button--top.add-block-button--active {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.group:hover .add-block-button--bottom,
.group:focus-within .add-block-button--bottom,
.add-block-button--bottom:hover,
.add-block-button--bottom:focus-visible,
.add-block-button--bottom.add-block-button--active {
  opacity: 1;
  transform: translate(-50%, 50%) scale(1);
}

.add-block-button--premium:hover {
  background: #1650aa;
  box-shadow: 0 4px 14px rgba(29, 94, 199, 0.45);
}

.add-block-button--top:hover {
  transform: translate(-50%, -50%) scale(1.08);
}

.add-block-button--bottom:hover {
  transform: translate(-50%, 50%) scale(1.08);
}
</style>
