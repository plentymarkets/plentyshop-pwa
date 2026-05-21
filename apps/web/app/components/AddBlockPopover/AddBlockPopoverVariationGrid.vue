<template>
  <div class="grid grid-cols-4 gap-1.5">
    <button
      v-for="item in variations"
      :key="`${item.category.category}-${item.idx}`"
      :data-testid="`block-add-${item.category.category}-${item.idx}`"
      :disabled="isDisabled(item)"
      class="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-editor-border bg-white transition-all duration-150"
      :class="
        isDisabled(item)
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer hover:bg-editor-toc-hover hover:border-editor-accent-border-hover'
      "
      @click="select(item)"
    >
      <span
        v-if="getBlockIconSvg(item.category.blockName)"
        class="w-5 h-5 flex-shrink-0 [&_svg]:w-full [&_svg]:h-full opacity-50"
        v-html="getBlockIconSvg(item.category.blockName)"
      />
      <span v-else class="w-5 h-5 rounded bg-editor-surface-muted block flex-shrink-0" />
      <span class="text-4xs text-editor-text-muted leading-tight text-center break-words w-full line-clamp-2">
        {{ item.variation.title }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FlatVariation } from './types';
import { DEPTH_FORBIDDEN_CATEGORY_BLOCKS, SINGLETON_BLOCKS } from './constants';

defineProps<{ variations: FlatVariation[] }>();

const { popoverState, closeAddBlockPopover, clearPendingCancel } = useAddBlockPopover();
const { addNewBlock, getBlockDepth, blockExistsOnPage } = useBlockManager();

const targetUuid = computed(() => popoverState.value?.targetUuid ?? '');

const isDisabled = (item: FlatVariation): boolean => {
  const depth = getBlockDepth(targetUuid.value);
  const blockName = item.variation.template.en.name;
  const isNestedForbidden =
    (DEPTH_FORBIDDEN_CATEGORY_BLOCKS as readonly string[]).includes(item.category.blockName) && depth > 0;
  const isSingletonDuplicate =
    (SINGLETON_BLOCKS as readonly string[]).includes(blockName) && blockExistsOnPage(blockName);
  return isNestedForbidden || isSingletonDuplicate;
};

const select = async (item: FlatVariation) => {
  if (!popoverState.value) return;
  const { targetUuid: uuid, position } = popoverState.value;
  clearPendingCancel();
  closeAddBlockPopover();
  await addNewBlock(item.category.category, item.idx, uuid, position);
};
</script>
