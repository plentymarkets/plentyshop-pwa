<template>
  <div :id="`block-${index}`" :ref="getLazyLoadRef(props.block.name, props.block.meta.uuid)" :class="wrapperClass">
    <slot name="before" />

    <component :is="blockComponent" v-if="blockComponent" v-bind="contentProps" :index="index">
      <template v-if="block.type === 'structure'" #content="slotProps">
        <component
          :is="recursiveComponent"
          v-if="shouldShowBlock(slotProps.contentBlock, enableActions)"
          :index="index"
          :block="slotProps.contentBlock"
          :root="false"
          :enable-actions="enableActions"
          v-bind="{ ...recursiveProps, ...slotProps }"
        />
      </template>
    </component>

    <slot name="after" />
  </div>
</template>

<script lang="ts" setup>
import type { PageBlockContentProps } from './types';
import { usePageBlockRendering } from './usePageBlockRendering';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PageBlockContentProps>(), {
  enableActions: false,
  contentAttrs: () => ({}),
  recursiveProps: () => ({}),
  wrapperClass: '',
});

const { shouldShowBlock } = useBlocksVisibility();
const { blockComponent, contentProps, getLazyLoadRef } = usePageBlockRendering(props);
</script>
