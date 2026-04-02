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
          'outline outline-4 outline-editor-toc-selected': showOutline && !isDragging,
        },
        {
          'hover:outline hover:outline-4 hover:outline-editor-toc-selected':
            clientPreview && enableActions && !isTablet && root && !isDragging,
        },
      ]"
    >
      <ClientOnly>
        <button
          v-if="showTopAddBlockButton"
          class="add-block-button no-drag transition-opacity duration-200 z-[0] md:z-[1] lg:z-[40] absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
          data-testid="top-add-block"
          aria-label="top add block"
          @click.stop="addNewBlock(block, 'top')"
        >
          <SfTooltip :label="buttonLabel" placement="top" :show-arrow="true">
            <SfIconAdd class="cursor-pointer" />
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
          :actions="getBlockActions(block)"
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
          class="add-block-button no-drag z-[0] md:z-[1] lg:z-[40] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-[6px] bg-[#538aea] text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          :class="[
            {
              'opacity-100': isClicked && clickedBlockIndex === index,
              'bg-purple-600 rounded-none': shouldShowBottomAddInGrid,
              'rounded-[18px]': !shouldShowBottomAddInGrid,
            },
          ]"
          data-testid="bottom-add-block"
          aria-label="bottom add block"
          @click.stop="addNewBlock(block, 'bottom')"
        >
          <SfTooltip :label="buttonLabel" placement="bottom" :show-arrow="true">
            <SfIconAdd class="cursor-pointer" />
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
});

const route = useRoute();
const { isInEditorClient } = useEditorState();
const { locale, defaultLocale } = useI18n();
const { openDrawerWithView } = useSiteConfiguration();
const attrs = useAttrs();
const {
  isDragging,
  togglePlaceholder,
  multigridColumnUuid,
  lazyLoadStates,
  lazyLoadRefs,
  shouldLazyLoad,
  getLazyLoadKey,
  getLazyLoadConfig,
  getLazyLoadRef,
  getBlockDepth,
  showBottomAddInGrid,
} = useBlockManager();
const { shouldShowBlock } = useBlocksVisibility();
const { blockUuid } = useSiteConfiguration();
const shouldShowBottomAddInGrid = computed(() =>
  showBottomAddInGrid({
    blockMetaUuid: props.block.meta.uuid,
    blockName: props.block.name,
    isRowHovered: props.isRowHovered,
    getBlockDepth,
  }),
);
const clientPreview = ref(false);
const buttonLabel = 'Insert a new block at this position.';

const getBlockComponent = computed(() => {
  if (!props.block.name) return null;

  const loader = getBlockLoader(props.block.name);
  if (!loader) return null;

  return defineAsyncComponent({
    loader,
  });
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
    const observer = new window.IntersectionObserver(
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
  clientPreview.value = isInEditorClient.value;
  if (shouldLazyLoad(props.block.name)) observeLazyLoadSection(props.block.name);
});

const showOutline = computed(() => {
  return (
    clientPreview.value &&
    props.enableActions &&
    props.isClicked &&
    props.isTablet &&
    props.clickedBlockIndex === props.index
  );
});

const addNewBlock = (block: Block, position: BlockPosition) => {
  togglePlaceholder(block.meta.uuid, position);
  openDrawerWithView('blocksList');
  multigridColumnUuid.value = null;
};

const getHomePath = (localeCode: string) => (localeCode === defaultLocale ? '/' : `/${localeCode}`);

const isEditDisabled = () => {
  return route.fullPath !== getHomePath(locale.value);
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
    !isFooterBlock(props.block) &&
    (props.root || shouldShowBottomAddInGrid.value),
);

const getBlockActions = (block: Block) => {
  if (isGlobalBlock(block)) {
    return {
      isEditable: !isEditDisabled(),
      isMovable: false,
      isDeletable: false,
      classes: ['flex', 'items-center', 'right-0', 'top-0', 'border', 'border-[#538AEA]', 'bg-white'],
      buttonClasses: [],
      hoverBackground: ['hover:bg-gray-100'],
    };
  }
  return undefined;
};

const { hoveredUuid, setHoveredBlock, clearHoveredBlock } = useTableOfContents();

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
