<template>
  <div v-if="block.meta" :key="block.meta.uuid">
    <UiBlockPlaceholder v-if="displayTopPlaceholder(block.meta.uuid)" />
    <div
      :id="`block-${index}`"
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
        <SfIconAdd class="cursor-pointer" />
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
        <SfIconAdd class="cursor-pointer" />
      </button>
    </div>
    <UiBlockPlaceholder v-if="displayBottomPlaceholder(block.meta.uuid)" />
  </div>
</template>

<script lang="ts" setup>
import type { Block } from '@plentymarkets/shop-api';
import { SfIconAdd } from '@storefront-ui/vue';

const { $isPreview } = useNuxtApp();

interface Props {
  index: number;
  block: Block;
  disableActions: boolean;
  root: boolean;
  isClicked: boolean;
  clickedBlockIndex: number | null;
  isTablet: boolean;
  blockHasData?: (block: Block) => boolean;
  changeBlockPosition: (index: number, position: number) => void;
}

const props = defineProps<Props>();

const { drawerOpen, drawerView, openDrawerWithView } = useSiteConfiguration();
const { getSetting: getBlockSize } = useSiteSettings('blockSize');
const { visiblePlaceholder, togglePlaceholder, isDragging } = useBlockManager();
const attrs = useAttrs();

const blockSize = computed(() => getBlockSize());

const getBlockComponent = computed(() => {
  if (!props.block.name) return null;

  return defineAsyncComponent({
    loader: getBlockLoader(props.block.name),
  });
});

const contentProps = computed(() => {
  return props.root ? { ...props.block } : { ...props.block, ...attrs };
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

const addNewBlock = (block: Block, position: 'top' | 'bottom') => {
  togglePlaceholder(block.meta.uuid, position);
  openDrawerWithView('blocksList');
};

const isRootNonFooter = computed(() => props.root && props.block.name !== 'Footer');
</script>
