<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <div data-testid="image-text-form">
      <BlocksImageForm :uuid="imageBlock?.meta?.uuid || ''" />
      <BlocksTextCardForm :uuid="textCardBlock?.meta?.uuid || ''" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';
import type { TextCardProps } from '~/components/blocks/TextCard/types';
import type { ImageTextProps } from '~/components/blocks/Image/types';

const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

const multiGridStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as MultiGridProps,
);

const imageBlock = computed(
  () => (multiGridStructure.value.content.find((block) => block.name === 'Image') || {}) as ImageTextProps,
);
const textCardBlock = computed(
  () => (multiGridStructure.value.content.find((block) => block.name === 'TextCard') || {}) as TextCardProps,
);
</script>
