<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <div data-testid="image-text-form">
      <div v-for="block in multiGridStructure.content" :key="block.meta.uuid">
        <component
          :is="getComponent(block.name)"
          v-if="getComponent(block.name)"
          :uuid="block.meta?.uuid || ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MultiGridProps } from '~/components/blocks/structure/MultiGrid/types';

const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

const multiGridStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as MultiGridProps,
);

console.log('multiGridStructure', multiGridStructure.value);

const modules = import.meta.glob('@/components/**/blocks/**/*Form.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const getComponent = (blockName: string) => {
  if (!blockName) return null;
  const regex = new RegExp(`${blockName}Form\\.vue$`, 'i');
  const matched = Object.keys(modules).find((path) => regex.test(path));
  return matched ? defineAsyncComponent(modules[matched]) : null;
};
</script>
