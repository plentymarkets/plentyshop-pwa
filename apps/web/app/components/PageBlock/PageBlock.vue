<template>
  <div v-if="block.meta" :key="block.meta.uuid" :data-uuid="block.meta.uuid">
    <UiBlockPlaceholder v-if="displayTopPlaceholder(block.meta.uuid)" />
    <div
      :id="`block-${index}`"
      :ref="getLazyLoadRef(props.block.name, props.block.meta.uuid)"
      :class="[
        'relative block-wrapper',
        marginBottomClasses,
        {
          'outline outline-4 outline-[#538AEA]': showOutline && !isDragging,
        },
        {
          'hover:outline hover:outline-4 hover:outline-[#538AEA]':
            clientPreview && enableActions && !isTablet && root && !isDragging,
        },
      ]"
    >
      <ClientOnly>
        <button
          v-if="enableActions && clientPreview && root && !isDragging"
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
          v-if="enableActions && blockHasData && blockHasData(block) && clientPreview && root && !isDragging"
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

      <component :is="getBlockComponent" v-bind="contentProps" :index="index">
        <template v-if="block.type === 'structure'" #content="slotProps">
          <PageBlock
            :index="index"
            :block="slotProps.contentBlock"
            :root="false"
            :is-preview="clientPreview"
            :enable-actions="enableActions"
            :is-clicked="isClicked"
            :clicked-block-index="clickedBlockIndex"
            :is-tablet="isTablet"
            :block-has-data="blockHasData"
            :change-block-position="changeBlockPosition"
            :column-length="slotProps.columnLength"
            :is-row-hovered="slotProps.isRowHovered"
            v-bind="slotProps"
          />
        </template>
      </component>

      <ClientOnly>
        <button
          v-if="enableActions && clientPreview && !isDragging && props.block.name !== 'Footer' && (root || showBottomAddInGrid)"
          :key="isDragging ? 'dragging' : 'not-dragging'"
          class="add-block-button no-drag z-[0] md:z-[1] lg:z-[40] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index, 'bg-purple-600': showBottomAddInGrid }]"
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
    <UiBlockPlaceholder v-if="displayBottomPlaceholder(block.meta.uuid)" />
  </div>
</template>

<script lang="ts" setup>
import { SfIconAdd, SfTooltip } from '@storefront-ui/vue';
import type { BlockPosition } from '~/composables/useBlockManager/types';
import type { PageBlockProps } from './types';
import type { Block } from '@plentymarkets/shop-api';

const props = defineProps<PageBlockProps>();

const { $isPreview } = useNuxtApp();
const { locale, defaultLocale } = useI18n();
const route = useRoute();
const { drawerOpen, drawerView, openDrawerWithView } = useSiteConfiguration();
const { getSetting: getBlockSize } = useSiteSettings('blockSize');
const attrs = useAttrs();
const {
  visiblePlaceholder,
  togglePlaceholder,
  isDragging,
  multigridColumnUuid,
  lazyLoadStates,
  lazyLoadRefs,
  shouldLazyLoad,
  getLazyLoadKey,
  getLazyLoadConfig,
  getLazyLoadRef,
} = useBlockManager();
const { blockUuid } = useSiteConfiguration();

const { getBlockDepth } = useBlockManager();
const isInsideMultiGrid = computed(() => getBlockDepth(props.block.meta.uuid) > 0);
const showBottomAddInGrid = computed(() =>
  isInsideMultiGrid.value && props.columnLength === 1 && props.block.name !== 'EmptyGridBlock' && props.isRowHovered,
);

const clientPreview = ref(false);
const buttonLabel = 'Insert a new block at this position.';

const marginBottomClasses = computed(() => {
  if (props.block.name === 'MultiGrid') return '';
  if (!isRootNonFooter.value) return '';
  switch (blockSize.value) {
    case 's':
      return 'mb-s';
    case 'm':
      return 'mb-m';
    case 'l':
      return 'mb-l';
    case 'xl':
      return 'mb-xl';
    default:
      return '';
  }
});

const blockSize = computed(() => getBlockSize());

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
  clientPreview.value = !!$isPreview;
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

const displayTopPlaceholder = (uuid: string): boolean => {
  const visiblePlaceholderState = visiblePlaceholder.value;

  return (
    visiblePlaceholderState.position === 'top' &&
    visiblePlaceholderState.uuid === uuid &&
    drawerOpen.value &&
    drawerView.value === 'blocksList'
  );
};

const displayBottomPlaceholder = (uuid: string): boolean => {
  const visiblePlaceholderState = visiblePlaceholder.value;

  return (
    visiblePlaceholderState.position === 'bottom' &&
    visiblePlaceholderState.uuid === uuid &&
    drawerOpen.value &&
    drawerView.value === 'blocksList'
  );
};

const addNewBlock = (block: Block, position: BlockPosition) => {
  togglePlaceholder(block.meta.uuid, position);
  openDrawerWithView('blocksList');
  multigridColumnUuid.value = null;
};

const isRootNonFooter = computed(() => props.root && props.block.name !== 'Footer');
const getHomePath = (localeCode: string) => (localeCode === defaultLocale ? '/' : `/${localeCode}`);

const isEditDisabled = computed(() => {
  const homePath = getHomePath(locale.value);
  return route.fullPath !== homePath;
});

const getBlockActions = (block: Block) => {
  if (block.name === 'Footer') {
    return {
      isEditable: !isEditDisabled.value,
      isMovable: false,
      isDeletable: false,
      classes: ['flex', 'items-center', 'right-0', 'top-0', 'border', 'border-[#538AEA]', 'bg-white'],
      buttonClasses: [],
      hoverBackground: ['hover:bg-gray-100'],
    };
  }
  return undefined;
};
</script>
