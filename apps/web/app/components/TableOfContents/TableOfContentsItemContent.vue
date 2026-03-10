<template>
  <div
    class="flex items-center justify-between flex-1 px-2 py-1 rounded-md transition-colors hover:bg-editor-toc-highlight hover:text-black"
    :class="{ 'bg-editor-toc-selected text-white': isSelected }"
  >
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <slot name="arrow">
        <div class="shrink-0 w-4" />
      </slot>

      <div class="shrink-0 w-5 h-5 relative">
        <div class="transition-opacity" :class="{ 'group-hover:opacity-0': isRoot }">
          <span
            v-if="getBlockIconSvg(blockName)"
            class="block w-5 h-5 [&>svg]:w-full [&>svg]:h-full transition-all"
            :class="{
              '[&>svg]:brightness-0 [&>svg]:invert': isSelected,
              'group-hover:[&>svg]:brightness-100 group-hover:[&>svg]:invert-0': isSelected,
              'opacity-50': !isVisible,
            }"
            v-html="getBlockIconSvg(blockName)"
          />
          <NuxtImg
            v-else
            :src="defaultBlockIcon"
            class="w-5 h-5 transition-all"
            :class="{
              'brightness-0 invert group-hover:brightness-100 group-hover:invert-0': isSelected,
              'opacity-50': !isVisible,
            }"
          />
        </div>
        <div
          v-if="isRoot"
          class="toc-drag-handle absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
          @mousedown.stop
        >
          <NuxtImg width="18" height="18" :src="dragIcon" />
        </div>
      </div>

      <span class="truncate text-sm" :class="{ 'opacity-50': !isVisible }" :title="label">
        {{ label }}
      </span>
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <button
        class="p-1 opacity-0 group-hover:opacity-100 rounded hover:bg-editor-icon-hover"
        :data-testid="`toc-delete-${uuid}`"
        @click.stop="handleDelete"
      >
        <SfIconDelete class="!w-5 !h-5" />
      </button>
      <button
        v-if="!isFooterBlock(block)"
        class="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-editor-icon-hover"
        :class="{ 'opacity-100': !isVisible }"
        :data-testid="`toc-visibility-${uuid}`"
        @click.stop="handleToggleVisibility"
      >
        <SfIconVisibility v-if="isVisible" class="!w-5 !h-5 text-neutral-600" />
        <SfIconVisibilityOff v-else class="!w-5 !h-5 text-neutral-600" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconVisibility, SfIconVisibilityOff } from '@storefront-ui/vue';
import { getBlockIconSvg } from '~/utils/block-icons';
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';
import dragIcon from '~/assets/icons/paths/drag.svg';
import type { TableOfContentsItemContentProps } from './types';

const props = defineProps<TableOfContentsItemContentProps>();

const { deleteBlock } = useBlockManager();
const { isFooterBlock } = useBlockTemplates();

const isVisible = computed(() => (props.block.configuration as Record<string, unknown>)?.visible !== false);

const handleToggleVisibility = () => {
  const block = props.block as unknown as Record<string, unknown>;
  if (!block.configuration) {
    block.configuration = {};
  }
  (block.configuration as Record<string, unknown>).visible = !isVisible.value;
};

const handleDelete = () => {
  deleteBlock(props.uuid);
};
</script>
