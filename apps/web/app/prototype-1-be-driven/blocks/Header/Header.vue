<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    v-if="resolvedContent"
    :style="{
      backgroundColor: resolvedContent.layout?.backgroundColor || 'transparent',
      position: resolvedContent.layout?.sticky ? 'sticky' : 'relative',
      top: resolvedContent.layout?.sticky ? '0' : 'auto',
      zIndex: resolvedContent.layout?.sticky ? '50' : 'auto',
      height: resolvedContent.layout?.height || 'auto',
    }"
    data-testid="header-block"
  >
    <template v-if="isStructureBlock">
      <div v-for="(block, index) in resolvedContent.blocks" :key="block.meta?.uuid || index">
        <slot name="content" :content-block="block" :index="index" />
      </div>
    </template>

    <template v-else>
      <div v-for="(block, blockIndex) in resolvedContent.blocks" :key="block.meta?.uuid || blockIndex">
        <component :is="getBlockComponent(block)" v-bind="block" :index="blockIndex" />
      </div>
    </template>
  </header>
</template>

<script setup lang="ts">
import type { HeaderProps, HeaderSettings } from './types';
import { useHeader } from '~/prototype-1-be-driven/composables/useHeader/useHeader';
import { getBlockLoader } from '~/utils/blocks-imports';

// eslint-disable-next-line no-console
console.log('---- Using prototype 1 | Header as structure block ----');

const props = defineProps<HeaderProps>();
const { getHeaderSettings } = useHeader();

const slots = useSlots();
const isStructureBlock = computed(() => !!slots.content);

const resolvedContent = computed<HeaderSettings>(() => {
  if (props.content && !Array.isArray(props.content)) {
    return props.content as HeaderSettings;
  }
  if (Array.isArray(props.content)) {
    return {
      layout: props.configuration?.layout,
      blocks: props.content,
    };
  }
  return getHeaderSettings();
});

const getBlockComponent = (block: { name: string }) => {
  const loader = getBlockLoader(block.name);
  if (!loader) {
    // eslint-disable-next-line no-console
    console.warn(`Block component not found: ${block.name}`);
    return null;
  }
  return defineAsyncComponent({ loader });
};
</script>
