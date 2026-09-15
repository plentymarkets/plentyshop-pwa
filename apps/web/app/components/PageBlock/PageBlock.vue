<template>
  <div v-if="block.meta" :key="block.meta.uuid" :data-uuid="block.meta.uuid" class="h-full">
    <div
      :id="`block-${index}`"
      :ref="getLazyLoadRef(props.block.name, props.block.meta.uuid)"
      class="relative block-wrapper h-full"
    >
      <component :is="blockComponent" v-if="blockComponent" v-bind="contentProps" :index="index">
        <template v-if="block.type === 'structure'" #content="slotProps">
          <PageBlock
            v-if="shouldShowBlock(slotProps.contentBlock, enableActions)"
            :index="index"
            :block="slotProps.contentBlock"
            :root="false"
            :is-preview="false"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PageBlockProps } from './types';
import { usePageBlockRendering } from './usePageBlockRendering';

const props = withDefaults(defineProps<PageBlockProps>(), {
  enableActions: false,
  readOnly: false,
});

const { shouldShowBlock } = useBlocksVisibility();
const { blockComponent, contentProps, getLazyLoadRef } = usePageBlockRendering(props);
</script>
