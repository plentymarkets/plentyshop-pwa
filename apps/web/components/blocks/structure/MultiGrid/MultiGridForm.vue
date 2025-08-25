<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <div data-testid="image-text-form">
      <div v-for="column in multiGridStructure.content" :key="column.meta.uuid">
        <component
          :is="getComponent(column.name)"
          v-if="column.name !== 'EmptyGridBlock'"
          :uuid="column.meta?.uuid || ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';

const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

const multiGridStructure = computed(() => {
  return (findOrDeleteBlockByUuid(data.value, blockUuid.value) || { content: [] }) as {
    content: ColumnBlock[];
  };
});

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
