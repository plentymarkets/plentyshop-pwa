<template>
  <div class="relative">
    <div
      v-if="!customAdd"
      class="no-drag absolute inset-x-0 top-0 -translate-y-1/2 h-3 z-editor-inline flex items-center justify-center cursor-pointer"
      @mouseenter="insertHovered = true"
      @mouseleave="insertHovered = false"
      @click.stop="emit('insert-before', block, $event.currentTarget as HTMLElement)"
    >
      <div
        class="absolute inset-x-0 top-1/2 h-px"
        :class="insertHovered ? 'bg-editor-accent opacity-100' : 'opacity-0'"
      />
      <div
        v-show="insertHovered"
        class="relative w-4 h-4 rounded-full bg-editor-accent text-white flex items-center justify-center flex-shrink-0 z-dropdown shadow-sm"
      >
        <SfIconAdd size="xs" />
      </div>
    </div>

    <div
      data-el-item
      class="group/el flex items-center gap-1.5 px-2 py-1.5 border-b border-editor-border transition-colors hover:bg-editor-toc-hover cursor-pointer"
      :class="{ 'bg-editor-toc-hover': menuOpen || isActive }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="emit('select', index)"
    >
      <button
        class="el-drag-handle cursor-grab text-editor-text-dim hover:text-editor-text-placeholder p-0.5 flex-shrink-0"
        :data-testid="`actions-drag-item-handle-${index}`"
        :aria-label="getEditorTranslation('drag-handle-aria')"
      >
        <SfIconMenu size="xs" />
      </button>

      <div
        class="w-2.5 h-2.5 flex-shrink-0 rounded-sm"
        :class="block.name === 'EmptyGridBlock' ? 'border border-dashed border-editor-text-ghost' : ''"
        :style="
          block.name !== 'EmptyGridBlock'
            ? { backgroundColor: getBlockColor(block.name, isVisible ? 1 : 0.35) }
            : undefined
        "
      />

      <span
        class="flex-1 text-xs truncate min-w-0"
        :class="
          block.name !== 'EmptyGridBlock'
            ? isVisible
              ? 'text-editor-text-default'
              : 'text-editor-text-ghost line-through'
            : 'text-editor-text-ghost italic'
        "
      >
        {{ blockLabel }}
      </span>

      <SfIconVisibilityOff
        v-if="block.name !== 'EmptyGridBlock' && !isVisible"
        size="xs"
        class="flex-shrink-0 text-editor-text-ghost"
      />

      <span
        v-if="isGridMode && (isHovered || menuOpen)"
        class="text-3xs font-bold px-1 py-0.5 rounded flex-shrink-0"
        :class="
          block.name !== 'EmptyGridBlock'
            ? 'bg-editor-accent/10 text-editor-accent'
            : 'bg-editor-surface-muted text-editor-text-ghost'
        "
        >{{ blockSpan }}/12</span
      >

      <button
        v-show="block.name !== 'EmptyGridBlock'"
        :data-testid="`actions-edit-item-${index}`"
        class="no-drag p-0.5 rounded cursor-pointer text-editor-icon hover:text-editor-accent flex-shrink-0 transition-colors"
        :class="{ 'text-editor-icon/40': !isVisible }"
        :aria-label="getEditorTranslation('edit-aria')"
        @click.stop="emit('edit-element', block)"
      >
        <SfIconBase size="xs" viewBox="0 0 18 18">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path :d="editPath" fill="currentColor" />
          </svg>
        </SfIconBase>
      </button>

      <button
        v-if="isHovered && block.name === 'EmptyGridBlock'"
        class="no-drag text-3xs font-bold tracking-wider uppercase text-editor-accent flex-shrink-0 cursor-pointer"
        @click.stop="emit('replace-empty', $event.currentTarget as HTMLElement, block)"
      >
        {{ getEditorTranslation('replace') }}
      </button>

      <EditorGridElementsPanelGridElementsItemMenu
        :index="index"
        :is-open="menuOpen"
        :block-visible="isVisible"
        :min-items-reached="minItemsReached"
        :parent-uuid="isGridMode ? parentUuid : undefined"
        :column-index="isGridMode ? (block.parent_slot ?? 0) : undefined"
        @toggle="emit('toggle-menu', block.meta.uuid)"
        @toggle-visibility="emit('toggle-visibility', block)"
        @delete="emit('delete', block)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd, SfIconBase, SfIconMenu, SfIconVisibilityOff } from '@storefront-ui/vue';
import type { Block } from '@plentymarkets/shop-api';
import { editPath } from '~/assets/icons/paths/edit';

const props = defineProps<{
  block: Block;
  index: number;
  menuOpen: boolean;
  customAdd: boolean;
  isGridMode: boolean;
  blockSpan: number;
  minItemsReached: boolean;
  isActive?: boolean;
  parentUuid?: string;
  customLabel?: string;
}>();

const emit = defineEmits<{
  'insert-before': [block: Block, anchorEl: HTMLElement];
  'edit-element': [block: Block];
  'replace-empty': [anchorEl: HTMLElement, block: Block];
  'toggle-menu': [uuid: string];
  'toggle-visibility': [block: Block];
  delete: [block: Block];
  select: [index: number];
}>();

const isHovered = ref(false);
const insertHovered = ref(false);
const isVisible = computed(() => (props.block.configuration as Record<string, unknown>)?.visible !== false);

const blockLabel = computed(() => {
  if (props.block.name === 'EmptyGridBlock') {
    return getEditorTranslation('empty-block');
  }
  return props.customLabel || getBlockDisplayName(props.block.name);
});
</script>

<i18n lang="json">
{
  "en": {
    "empty-block": "Empty Block",
    "replace": "Replace",
    "drag-handle-aria": "Drag to reorder",
    "edit-aria": "Edit block"
  },
  "de": {
    "empty-block": "Empty Block",
    "replace": "Replace",
    "drag-handle-aria": "Drag to reorder",
    "edit-aria": "Edit block"
  }
}
</i18n>
