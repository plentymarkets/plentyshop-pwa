<template>
  <div
    v-if="block.meta"
    :key="block.meta.uuid"
    :data-uuid="block.meta.uuid"
    class="h-full"
    @mouseenter="onBlockHover"
    @mouseleave="onBlockUnhover"
  >
    <PageBlockContent
      :index="index"
      :block="block"
      :root="root"
      :enable-actions="enableActions"
      :content-attrs="attrs"
      :recursive-component="EditorPageBlock"
      :recursive-props="recursiveProps"
      :wrapper-class="[
        'relative block-wrapper h-full',
        {
          'block-hoverable group/block':
            clientPreview && enableActions && !isTablet && root && !isDragging && !isPopoverTarget,
        },
      ]"
    >
      <template #before>
        <div
          v-if="showOutline && !isDragging"
          class="pointer-events-none absolute inset-[-6px] block-selected-outline"
        />
        <EditorAddBlockButton
          :block="block"
          :index="index"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :root="root"
          :enable-actions="enableActions"
          position="top"
        />

        <UiBlockActions
          v-if="enableActions && clientPreview && root && !isDragging"
          :key="`${block.meta.uuid}`"
          :class="[
            'opacity-0',
            {
              'hover:opacity-100 group-hover/block:opacity-100 group-hover/block:translate-y-0': !isTablet,
              '!opacity-100 !translate-y-0': isTablet && isClicked && clickedBlockIndex === index,
            },
          ]"
          :index="index"
          :block="block"
          :read-only="readOnly"
          @change-position="changeBlockPosition"
        />
      </template>

      <template #after>
        <EditorAddBlockButton
          :block="block"
          :index="index"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :root="root"
          :enable-actions="enableActions"
          position="bottom"
        />
      </template>
    </PageBlockContent>
  </div>
</template>

<script lang="ts" setup>
import type { EditorPageBlockProps } from '../PageBlock/types';
import PageBlockContent from '../PageBlock/PageBlockContent.vue';

const props = withDefaults(defineProps<EditorPageBlockProps>(), {
  enableActions: false,
  readOnly: false,
});

const attrs = useAttrs();
const EditorPageBlock = getCurrentInstance()!.type;
const viewport = useViewport();
const { isInEditorClient } = useEditorState();
const { isDragging } = useBlockManager();
const { popoverState } = useAddBlockPopover();
const { hoveredUuid, highlightedUuid, setHoveredBlock, clearHoveredBlock } = useTableOfContents();

const clientPreview = computed(() => isInEditorClient.value && viewport.isGreaterOrEquals('lg'));
const recursiveProps = computed(() => ({
  isPreview: clientPreview.value,
  isClicked: props.isClicked,
  readOnly: props.readOnly,
  clickedBlockIndex: props.clickedBlockIndex,
  isTablet: props.isTablet,
  changeBlockPosition: props.changeBlockPosition,
}));

const isPopoverTarget = computed(
  () => clientPreview.value && props.enableActions && popoverState.value?.targetUuid === props.block.meta.uuid,
);

const showOutline = computed(() => {
  return (
    (clientPreview.value &&
      props.enableActions &&
      props.isClicked &&
      props.isTablet &&
      props.clickedBlockIndex === props.index) ||
    highlightedUuid.value === props.block.meta.uuid ||
    isPopoverTarget.value
  );
});

const onBlockHover = () => {
  if (props.root) {
    setHoveredBlock(props.block.meta.uuid);
  }
};

const onBlockUnhover = () => {
  if (props.root && hoveredUuid.value === props.block.meta.uuid) {
    clearHoveredBlock();
  }
};
</script>

<style scoped>
.block-hoverable::before,
.block-selected-outline::before {
  content: '';
  position: absolute;
  pointer-events: none;
  border-style: solid;
  @apply border-editor-block-selected;
}

.block-hoverable::before {
  inset: -1px;
  z-index: 30;
  border-width: 3px;
  opacity: 0;
  @apply shadow-block-outline;
}

.block-hoverable:hover::before {
  opacity: 1;
}

.block-selected-outline::before {
  inset: 6px;
  border-width: 4px;
  @apply shadow-block-outline-selected;
}
</style>
