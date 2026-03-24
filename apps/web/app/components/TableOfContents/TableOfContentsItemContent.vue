<template>
  <div
    class="flex items-center justify-between flex-1 px-2 py-1 rounded-md transition-colors hover:bg-editor-toc-highlight hover:text-black"
    :class="{
      'bg-editor-toc-selected text-white': isSelected,
      'bg-editor-toc-hover': isHovered && !isSelected,
    }"
  >
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <slot name="arrow">
        <div class="shrink-0 w-4" />
      </slot>

      <div class="shrink-0 w-5 h-5 relative">
        <div class="transition-opacity" :class="{ 'group-hover:opacity-0': isRoot && !isGlobalBlock(block) }">
          <span
            v-if="getBlockIconSvg(blockName)"
            :data-testid="`toc-block-icon-${uuid}`"
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
            :data-testid="`toc-block-icon-${uuid}`"
            :src="defaultBlockIcon"
            class="w-5 h-5 transition-all"
            :class="{
              'brightness-0 invert group-hover:brightness-100 group-hover:invert-0': isSelected,
              'opacity-50': !isVisible,
            }"
          />
        </div>
        <div
          v-if="isRoot && !isGlobalBlock(block)"
          class="toc-drag-handle absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
          @mousedown.stop
        >
          <NuxtImg width="18" height="18" :src="dragIcon" />
        </div>
      </div>

      <span data-testid="toc-label" class="truncate text-sm" :class="{ 'opacity-50': !isVisible }" :title="label">
        {{ label }}
      </span>
    </div>

    <div v-if="!isGlobalBlock(block)" class="flex items-center gap-1 shrink-0">
      <button
        class="p-1 opacity-0 group-hover:opacity-100 rounded hover:bg-editor-icon-hover group-hover:text-black"
        :class="{ 'text-white': isSelected }"
        :data-testid="`toc-delete-${uuid}`"
        :aria-label="getEditorTranslation('delete-block-label')"
        @click.stop="handleDelete"
      >
        <SfIconDelete class="!w-5 !h-5" />
      </button>
      <button
        class="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-editor-icon-hover group-hover:text-black"
        :class="{ 'opacity-100': !isVisible, 'text-white': isSelected }"
        :data-testid="`toc-visibility-${uuid}`"
        :aria-label="isVisible ? getEditorTranslation('hide-block-label') : getEditorTranslation('show-block-label')"
        @click.stop="handleToggleVisibility"
      >
        <SfIconVisibility
          v-if="isVisible"
          class="!w-5 !h-5 text-neutral-600 group-hover:text-black"
          :class="{ '!text-white': isSelected, 'group-hover:!text-black': isSelected }"
        />
        <SfTooltip v-else :label="getEditorTranslation('invisible-blocks-info')" placement="left">
          <SfIconVisibilityOff
            class="!w-5 !h-5 text-neutral-600 group-hover:text-black"
            :class="{ '!text-white': isSelected, 'group-hover:!text-black': isSelected }"
          />
        </SfTooltip>
      </button>
    </div>
    <div v-else class="flex items-center gap-1 shrink-0 h-[30px]" />
  </div>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconVisibility, SfIconVisibilityOff, SfTooltip } from '@storefront-ui/vue';
import { getBlockIconSvg } from '~/utils/block-icons';
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';
import dragIcon from '~/assets/icons/paths/drag.svg';
import type { TableOfContentsItemContentProps } from './types';

const props = defineProps<TableOfContentsItemContentProps>();

const { deleteBlock } = useBlockManager();
const { isBlockVisible, toggleBlockVisibility } = useBlocksVisibility();
const { hoveredUuid } = useTableOfContents();

const isVisible = computed(() => isBlockVisible(props.block));
const isHovered = computed(() => hoveredUuid.value === props.uuid);

const handleToggleVisibility = () => {
  toggleBlockVisibility(props.block);
};

const handleDelete = () => {
  deleteBlock(props.uuid);
};
</script>

<i18n lang="json">
{
  "en": {
    "delete-block-label": "Delete block",
    "hide-block-label": "Hide block",
    "show-block-label": "Show block",
    "invisible-blocks-info": "Hidden blocks are still loaded. A large number of hidden blocks may affect your shop's performance."
  },
  "de": {
    "delete-block-label": "Delete block",
    "hide-block-label": "Hide block",
    "show-block-label": "Show block",
    "invisible-blocks-info": "Hidden blocks are still loaded. A large number of hidden blocks may affect your shop's performance."
  }
}
</i18n>
