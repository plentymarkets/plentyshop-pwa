<template>
  <div v-if="block.meta" :key="block.meta.uuid">
    <UiBlockPlaceholder v-if="displayTopPlaceholder(block.meta.uuid)" />
    <div
      :id="`block-${index}`"
      :ref="
        shouldLazyLoad(props.block.name)
          ? (el) => (lazyLoadRefs[getLazyLoadKey(props.block.name, props.block.meta.uuid)] = el as HTMLElement)
          : undefined
      "
      :class="[
        'relative block-wrapper',
        {
          'mb-s': blockSize === 's' && isRootNonFooter,
          'mb-m': blockSize === 'm' && isRootNonFooter,
          'mb-l': blockSize === 'l' && isRootNonFooter,
          'mb-xl': blockSize === 'xl' && isRootNonFooter,
        },
        {
          'outline outline-4 outline-[#538AEA]': showOutline && !isDragging,
        },
        {
          'hover:outline hover:outline-4 hover:outline-[#538AEA]':
            $isPreview && disableActions && !isTablet && root && !isDragging,
        },
      ]"
    >
      <button
        v-if="disableActions && $isPreview && root && !isDragging"
        class="add-block-button no-drag transition-opacity duration-200 z-[0] md:z-[1] lg:z-[10] absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
        :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
        data-testid="top-add-block"
        aria-label="top add block"
        @click.stop="addNewBlock(block, 'top')"
      >
        <SfTooltip :label="buttonLabel" placement="top" :show-arrow="true">
          <SfIconAdd class="cursor-pointer" />
        </SfTooltip>
      </button>

      <UiBlockActions
        v-if="disableActions && blockHasData && blockHasData(block) && $isPreview && root && !isDragging"
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

      <component :is="getBlockComponent" v-bind="contentProps" :index="index">
        <template v-if="block.type === 'structure'" #content="slotProps">
          <PageBlock
            :index="index"
            :block="slotProps.contentBlock"
            :root="false"
            :is-preview="$isPreview"
            :disable-actions="disableActions"
            :is-clicked="isClicked"
            :clicked-block-index="clickedBlockIndex"
            :is-tablet="isTablet"
            :block-has-data="blockHasData"
            :change-block-position="changeBlockPosition"
            v-bind="slotProps"
          />
        </template>
      </component>

      <button
        v-if="disableActions && $isPreview && root && !isDragging && props.block.name !== 'Footer'"
        :key="isDragging ? 'dragging' : 'not-dragging'"
        class="add-block-button no-drag z-[0] md:z-[1] lg:z-[10] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100"
        :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
        data-testid="bottom-add-block"
        aria-label="bottom add block"
        @click.stop="addNewBlock(block, 'bottom')"
      >
        <SfTooltip :label="buttonLabel" placement="bottom" :show-arrow="true">
          <SfIconAdd class="cursor-pointer" />
        </SfTooltip>
      </button>
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
} = useBlockManager();

const buttonLabel = 'Insert a new block at this position.';

const blockSize = computed(() => getBlockSize());

const getBlockComponent = computed(() => {
  if (!props.block.name) return null;

  return defineAsyncComponent({
    loader: getBlockLoader(props.block.name),
  });
});

const contentProps = computed(() => {
  const baseProps = props.root ? { ...props.block } : { ...props.block, ...attrs };
  const config = getLazyLoadConfig(props.block.name);

  if (config) {
    const uniqueKey = getLazyLoadKey(props.block.name, props.block.meta.uuid);
    const lazyLoadState = lazyLoadStates.value[uniqueKey] || false;

    return { ...baseProps, [config.propName]: lazyLoadState };
  }

  return baseProps;
});

const observeLazyLoadSection = (blockName: string) => {
  const config = getLazyLoadConfig(blockName);
  const uniqueKey = getLazyLoadKey(blockName, props.block.meta.uuid);

  if (import.meta.client && lazyLoadRefs.value[uniqueKey] && config) {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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

const showOutline = computed(() => {
  return (
    $isPreview && props.disableActions && props.isClicked && props.isTablet && props.clickedBlockIndex === props.index
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
      classes: ['right-0', 'top-0', 'border', 'border-[#538AEA]', 'bg-white'],
    };
  }
  return undefined;
};
</script>
