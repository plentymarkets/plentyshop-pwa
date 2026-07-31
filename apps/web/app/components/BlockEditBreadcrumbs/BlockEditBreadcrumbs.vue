<template>
  <nav
    v-if="items.length > 1"
    data-testid="block-edit-breadcrumbs"
    :aria-label="getEditorTranslation('breadcrumbs-aria-label')"
    class="flex items-center px-4 py-2 bg-editor-surface border-b border-editor-border text-2xs overflow-hidden"
  >
    <ol class="flex items-center min-w-0 w-full flex-nowrap">
      <li
        v-for="(crumb, i) in items"
        :key="`crumb-${crumb.uuid}-${i}`"
        class="flex items-center min-w-0"
        :class="i === items.length - 1 ? 'shrink min-w-[3ch]' : 'shrink-0'"
      >
        <SfIconChevronRight v-if="i > 0" size="xs" class="text-editor-text-ghost mx-0.5 shrink-0" aria-hidden="true" />
        <button
          type="button"
          :data-testid="`breadcrumb-${i}`"
          :disabled="i === items.length - 1"
          :aria-current="i === items.length - 1 ? 'page' : undefined"
          class="px-1.5 py-0.5 rounded-md truncate transition-colors"
          :class="
            i === items.length - 1
              ? 'font-semibold text-editor-text-strong cursor-default'
              : 'text-editor-text-faint hover:text-editor-text-default hover:bg-editor-toc-hover cursor-pointer max-w-[12ch]'
          "
          @click="onSelect(i)"
        >
          {{ crumb.label }}
        </button>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { SfIconChevronRight } from '@storefront-ui/vue';
import type { BlockEditBreadcrumbItem } from './types';

const { blockType, blockUuid } = useSiteConfiguration();
const { stack, truncateStackTo } = useBlockEditStack();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { allBlocks } = useBlocks();

const rootBlock = computed(() => findOrDeleteBlockByUuid(allBlocks.value, blockUuid.value));

const rootLabel = computed(() => {
  if (blockType.value === 'Carousel') {
    const firstChild = (rootBlock.value?.content as Array<{ name: string }>)?.[0];

    if (firstChild?.name) {
      return getBlockDisplayName(firstChild.name);
    }
  }
  return getBlockDisplayName(blockType.value);
});

const items = computed<BlockEditBreadcrumbItem[]>(() => {
  if (!blockUuid.value) {
    return [];
  }
  const root: BlockEditBreadcrumbItem = { label: rootLabel.value, uuid: blockUuid.value };
  const nested: BlockEditBreadcrumbItem[] = stack.value.map((entry) => ({
    label: getBlockDisplayName(entry.name),
    uuid: entry.meta.uuid,
  }));
  return [root, ...nested];
});

const onSelect = (index: number) => {
  if (index >= items.value.length - 1) {
    return;
  }
  truncateStackTo(index);
};
</script>

<i18n lang="json">
{
  "en": {
    "breadcrumbs-aria-label": "Block edit breadcrumbs"
  },
  "de": {
    "breadcrumbs-aria-label": "Block edit breadcrumbs"
  }
}
</i18n>
