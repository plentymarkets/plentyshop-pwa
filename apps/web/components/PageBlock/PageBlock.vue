<template>
  <div
    :class="[
      block.name === 'UiHeroCarousel'
        ? 'new-classes-for-hero-carousel'
        : 'relative max-w-screen-3xl mx-auto md:px-6 lg:px-10 mt-3 mb-10 group',
      {
        'outline outline-4 outline-[#538AEA]':
          isPreview && disableActions && isClicked && isTablet && clickedBlockIndex === index,
      },
      { 'hover:outline hover:outline-4 hover:outline-[#538AEA]': isPreview && disableActions && !isTablet },
    ]"
    @click="tabletEdit(index)"
    data-testid="block-wrapper"
  >
    <button
      v-if="disableActions && isPreview"
      @click.stop="addNewBlock(index, -1)"
      class="z-[0] md:z-[0] lg:z-[10] absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
      :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
      data-testid="top-add-block"
    >
      <SfIconAdd class="cursor-pointer"></SfIconAdd>
    </button>
    <UiBlockActions
      v-if="disableActions && blockHasData && blockHasData(block) && isPreview"
      :class="[
        'opacity-0',
        {
          'hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100': !isTablet,
          'opacity-100': isTablet && isClicked && clickedBlockIndex === index,
        },
      ]"
      :index="index"
      @edit="handleEdit"
      @delete="deleteBlock"
    />
    <component
      v-if="block.name !== 'NewsletterSubscribe' || showNewsletter"
      :is="getComponent && getComponent(block.name)"
      v-bind="block.options"
    />
    <button
      v-if="disableActions && isPreview"
      @click.stop="addNewBlock(index, 1)"
      class="z-[0] md:z-[0] lg:z-[10] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-[18px] p-[6px] bg-[#538aea] text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100"
      :class="[{ 'opacity-100': isClicked && clickedBlockIndex === index }]"
      data-testid="bottom-add-block"
    >
      <SfIconAdd class="cursor-pointer"></SfIconAdd>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { SfIconAdd } from '@storefront-ui/vue';

interface Props {
  index: number;
  block: Block;
  isPreview: boolean;
  disableActions: boolean;
  isClicked: boolean;
  clickedBlockIndex: number | null;
  isTablet: boolean;
  showNewsletter: boolean;
  blockHasData?: (block: Block) => boolean;
  getComponent?: (name: string) => unknown;
  tabletEdit: (index: number) => void;
  addNewBlock: (index: number, position: number) => void;
  handleEdit: (index: number) => void;
  deleteBlock: (index: number) => void;
}

defineProps<Props>();
</script>
