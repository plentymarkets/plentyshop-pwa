<template>
  <div
    :class="[
      'absolute inline-flex items-center gap-0.5 p-1 z-base @md:z-raised @lg:z-editor-inline',
      'rounded-full bg-white/95 border border-slate-900/10 backdrop-blur-md',
      'shadow-block-actions hover:shadow-block-actions-hover',
      '-translate-y-1 hover:translate-y-0 transition-all duration-[540ms] ease-editor-out',
      'block-actions',
      ...(props.actions?.classes || []),
      ...(props.actions?.buttonClasses || []),
    ]"
    data-testid="edit-block-actions"
  >
    <SfTooltip
      v-if="!props.actions.isEditable"
      :label="getEditorUITranslation('block-edit-homepage-only', { blockName: props.block.name.toLowerCase() })"
      placement="top"
      :class="tooltipWrapperClasses"
    >
      <button
        :class="primaryButtonClasses"
        :data-testid="`${props.block.name}-open-editor-button`"
        aria-label="editor button"
        :disabled="!props.actions.isEditable"
        @click.stop="triggerEdit"
      >
        <SfIconBase size="xs" viewBox="0 0 18 18">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="editPath" fill="currentColor" />
          </svg>
        </SfIconBase>
      </button>
    </SfTooltip>
    <SfTooltip v-else :label="editLabel" placement="top" :show-arrow="true" :class="tooltipWrapperClasses">
      <button
        :class="primaryButtonClasses"
        :data-testid="`${props.block.name}-open-editor-button`"
        aria-label="editor button"
        @click.stop="triggerEdit"
      >
        <SfIconBase size="xs" viewBox="0 0 18 18" class="cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="editPath" fill="currentColor" />
          </svg>
        </SfIconBase>
      </button>
    </SfTooltip>

    <template v-if="!props.readOnly">
      <span v-if="props.actions.isMovable" :class="dividerClasses" />

      <SfTooltip
        v-if="props.actions.isMovable"
        :label="positionLabel"
        placement="top"
        :show-arrow="true"
        :class="tooltipWrapperClasses"
      >
        <button
          :class="primaryButtonClasses"
          data-testid="move-up-button"
          aria-label="move up button"
          :disabled="isFirstContentBlock(props.index)"
          @click="changePosition(-1)"
        >
          <SfIconExpandLess size="xs" />
        </button>
      </SfTooltip>
      <SfTooltip
        v-if="props.actions.isMovable"
        :label="positionLabel"
        placement="top"
        :show-arrow="true"
        :class="tooltipWrapperClasses"
      >
        <button
          :class="primaryButtonClasses"
          data-testid="move-down-button"
          aria-label="move down button"
          :disabled="isLastNonFooterBlock(index)"
          @click="changePosition(1)"
        >
          <SfIconExpandMore size="xs" />
        </button>
      </SfTooltip>

      <SfTooltip
        v-if="props.actions.isMovable"
        :label="positionLabel"
        placement="top"
        :show-arrow="true"
        :class="tooltipWrapperClasses"
      >
        <button :class="dragButtonClasses" aria-label="Drag to reorder block">
          <NuxtImg width="16" height="16" :src="dragIcon" class="block" />
        </button>
      </SfTooltip>

      <span v-if="props.actions.isDeletable" :class="dividerClasses" />

      <SfTooltip
        v-if="props.actions.isDeletable"
        :label="deleteLabel"
        placement="top"
        :show-arrow="true"
        :class="tooltipWrapperClasses"
      >
        <button
          :class="dangerButtonClasses"
          aria-label="delete block button"
          data-testid="delete-block-button"
          @click="triggerDelete"
        >
          <SfIconDelete size="xs" />
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

const buttonStructure = [
  'w-7 h-7 rounded-full border-0 p-0 shrink-0',
  'inline-flex items-center justify-center leading-none',
  'bg-transparent text-editor-icon',
  'transition-all duration-200 ease-editor-out',
  'hover:scale-110 active:scale-95',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100',
  'focus-visible:outline-2 focus-visible:outline-editor-block-selected focus-visible:outline-offset-1',
].join(' ');

const primaryInteraction =
  'hover:bg-editor-block-selected/10 hover:text-editor-block-selected hover:shadow-block-action-btn active:bg-editor-block-selected/20';

const dangerInteraction =
  'hover:bg-editor-danger/10 hover:text-editor-danger hover:shadow-block-action-btn-danger active:bg-editor-danger/20';

const primaryButtonClasses = `${buttonStructure} ${primaryInteraction} cursor-pointer no-drag`;
const dangerButtonClasses = `${buttonStructure} ${dangerInteraction} cursor-pointer no-drag`;

const dragButtonClasses = `${buttonStructure} ${primaryInteraction} cursor-grab active:cursor-grabbing drag-handle`;

const dividerClasses = 'inline-block w-px h-3.5 bg-slate-900/10 mx-0.5';

const tooltipWrapperClasses = 'inline-flex items-center leading-none';

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
