<template>
  <div
    :class="[
      'absolute z-[0] md:z-[1] lg:z-[40] block-actions-toolbar',
      ...(props.actions?.classes || []),
      ...(props.actions?.buttonClasses || []),
    ]"
    data-testid="edit-block-actions"
  >
    <SfTooltip
      v-if="!props.actions.isEditable"
      :label="getEditorUITranslation('block-edit-homepage-only', { blockName: props.block.name.toLowerCase() })"
      placement="top"
      class="flex"
    >
      <button
        class="block-actions-btn no-drag"
        :data-testid="`${props.block.name}-open-editor-button`"
        aria-label="editor button"
        :disabled="!props.actions.isEditable"
        @click.stop="triggerEdit"
      >
        <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="editPath" fill="currentColor" />
          </svg>
        </SfIconBase>
      </button>
    </SfTooltip>
    <SfTooltip v-else :label="editLabel" placement="top" :show-arrow="true">
      <button
        class="block-actions-btn no-drag"
        :data-testid="`${props.block.name}-open-editor-button`"
        aria-label="editor button"
        @click.stop="triggerEdit"
      >
        <SfIconBase size="xs" viewBox="0 0 18 18" class="cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="editPath" fill="currentColor" />
          </svg>
        </SfIconBase>
      </button>
    </SfTooltip>

    <template v-if="!props.readOnly">
      <span v-if="props.actions.isMovable" class="block-actions-divider" />

      <SfTooltip v-if="props.actions.isMovable" :label="positionLabel" placement="top" :show-arrow="true">
        <button
          class="block-actions-btn no-drag"
          data-testid="move-up-button"
          aria-label="move up button"
          :disabled="isFirstContentBlock(props.index)"
          @click="changePosition(-1)"
        >
          <SfIconExpandLess />
        </button>
      </SfTooltip>
      <SfTooltip v-if="props.actions.isMovable" :label="positionLabel" placement="top" :show-arrow="true">
        <button
          class="block-actions-btn no-drag"
          data-testid="move-down-button"
          aria-label="move down button"
          :disabled="isLastNonFooterBlock(index)"
          @click="changePosition(1)"
        >
          <SfIconExpandMore />
        </button>
      </SfTooltip>

      <SfTooltip v-if="props.actions.isMovable" :label="positionLabel" placement="top" :show-arrow="true">
        <button class="block-actions-btn drag-handle drag-trigger" aria-label="Drag to reorder block">
          <NuxtImg width="18" height="18" :src="dragIcon" />
        </button>
      </SfTooltip>

      <span v-if="props.actions.isDeletable" class="block-actions-divider" />

      <SfTooltip v-if="props.actions.isDeletable" :label="deleteLabel" placement="top" :show-arrow="true">
        <button
          class="block-actions-btn block-actions-btn--danger no-drag"
          aria-label="delete block button"
          data-testid="delete-block-button"
          @click="triggerDelete"
        >
          <SfIconDelete />
        </button>
      </SfTooltip>
    </template>
  </div>
</template>

<script lang="ts" setup>
import dragIcon from '~/assets/icons/paths/drag.svg';
import { SfIconDelete, SfIconExpandLess, SfIconExpandMore, SfIconBase, SfTooltip } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';
import type { BlockActionsProps } from '~/components/ui/BlockActions/types';
const editLabel = 'Click to edit this block.';
const positionLabel = 'Change block position.';
const deleteLabel = 'Delete this block.';

const props = withDefaults(defineProps<BlockActionsProps>(), {
  readOnly: false,
  actions: () => ({
    isEditable: true,
    isMovable: true,
    isDeletable: true,
    classes: ['top-2', 'right-2'],
    buttonClasses: [],
    hoverBackground: [],
  }),
});
const emit = defineEmits(['edit', 'delete', 'change-position']);
const { openDrawerWithView } = useSiteConfiguration();
const { deleteBlock, isLastNonFooterBlock, isFirstContentBlock } = useBlockManager();

const triggerEdit = () => {
  openDrawerWithView('blocksSettings', props.block);
};

const triggerDelete = () => {
  deleteBlock(props.block.meta.uuid);
};

const scrollToBlock = (newIndex: number) => {
  const block = document.getElementById(`block-${newIndex}`);
  if (block) {
    block.scrollIntoView(true);
    window.scrollBy(0, -200);
  }
};
let timeoutId: ReturnType<typeof setTimeout>;

const changePosition = (position: number) => {
  emit('change-position', props.index, position);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    scrollToBlock(props.index + position);
  }, 100);
};
</script>

<style scoped>
.block-actions-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 10px 28px -10px rgba(15, 23, 42, 0.22),
    0 4px 10px -4px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transform: translateY(-4px);
  transition:
    opacity 540ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 540ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 540ms cubic-bezier(0.16, 1, 0.3, 1);
}

.block-hoverable:hover .block-actions-toolbar,
.block-hoverable:focus-within .block-actions-toolbar,
.block-actions-toolbar:hover {
  transform: translateY(0);
}

.block-actions-toolbar:hover {
  box-shadow:
    0 14px 36px -10px rgba(15, 23, 42, 0.3),
    0 6px 14px -4px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.block-actions-divider {
  width: 1px;
  height: 14px;
  background: rgba(15, 23, 42, 0.08);
  margin: 0 2px;
  display: inline-block;
}

.block-actions-btn {
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: #4b5563;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 0;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background-color 160ms cubic-bezier(0.16, 1, 0.3, 1),
    color 160ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.block-actions-btn :deep(svg),
.block-actions-btn :deep(img) {
  width: 16px !important;
  height: 16px !important;
  display: block;
  flex-shrink: 0;
  margin: 0;
}

.block-actions-toolbar :deep([data-testid='tooltip']) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.block-actions-btn:hover:not(:disabled) {
  background: rgba(29, 94, 199, 0.1);
  color: #1d5ec7;
  transform: scale(1.08);
  box-shadow: 0 2px 8px -2px rgba(29, 94, 199, 0.25);
}

.block-actions-btn:active:not(:disabled) {
  transform: scale(0.96);
  background: rgba(29, 94, 199, 0.18);
  box-shadow: none;
}

.block-actions-btn:focus-visible {
  outline: 2px solid #1d5ec7;
  outline-offset: 1px;
}

.block-actions-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.block-actions-btn--danger:hover:not(:disabled) {
  background: rgba(204, 51, 51, 0.1);
  color: #cc3333;
  box-shadow: 0 2px 8px -2px rgba(204, 51, 51, 0.25);
}

.block-actions-btn.drag-handle {
  cursor: grab;
}

.block-actions-btn.drag-handle:active {
  cursor: grabbing;
}
</style>
