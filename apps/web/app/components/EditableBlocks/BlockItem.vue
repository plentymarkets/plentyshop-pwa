<template>
  <component :is="isNarrowContainer ? NarrowContainer : 'div'" v-if="shouldShowBlock(block, enableActions)">
    <component
      :is="pageBlockComponent"
      :index="index"
      :block="block"
      :enable-actions="enableActions"
      root
      v-bind="props.editorPageBlockProps"
      class="group"
      :class="getBlockClass(block).value"
      data-testid="block-wrapper"
      @click="tabletEdit(index)"
    />
  </component>
</template>

<script lang="ts" setup>
import type { BlockWithLayout, EditableBlockItemProps } from './types';

const props = defineProps<EditableBlockItemProps>();
const NarrowContainer = resolveComponent('NarrowContainer');
const { shouldShowBlock } = useBlocksVisibility();

const isNarrowContainer = computed(() => {
  const layoutBlock = props.block as BlockWithLayout;
  return layoutBlock.content?.layout?.narrowContainer || layoutBlock.layout?.narrowContainer;
});
</script>
