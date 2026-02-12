<template>
  <header data-testid="header-area">
    <component
      :is="getBlockComponent(block.name)"
      v-for="block in headerBlocks"
      :key="block.meta?.uuid"
      v-bind="block"
    />
  </header>
</template>

<script setup lang="ts">
import { getBlockLoader } from '~/utils/blocks-imports';
import { usePageAreas } from '../composables/usePageAreas';

// eslint-disable-next-line no-console
console.log('---- Using prototype 2 | Header as separate area ----');

const { areas } = usePageAreas();
const headerBlocks = computed(() => areas.value.header);

const getBlockComponent = (name: string) => {
  const loader = getBlockLoader(name);
  return loader ? defineAsyncComponent({ loader }) : null;
};
</script>
