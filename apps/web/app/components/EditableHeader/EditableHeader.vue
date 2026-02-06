<template>
  <div data-testid="editable-header">
    <draggable
      v-if="props.header && props.header.length > 0"
      v-model="headerBlocks"
      item-key="meta.uuid"
      handle=".drag-handle"
      class="content"
      :filter="'.no-drag'"
      :prevent-on-filter="false"
      @start="handleDragStart"
      @end="handleDragEnd"
    >
      <template #item="{ element: block, index }">
        <PageBlock
          :block="block"
          :index="index"
          :root="true"
          :enable-actions="enabledActions"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :is-tablet="isTablet"
          :change-block-position="changeBlockPosition"
          class="group"
          @click="tabletEdit(index)"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import draggable from 'vuedraggable/src/vuedraggable';

interface EditableHeaderProps {
  header?: Block[];
}

const props = withDefaults(defineProps<EditableHeaderProps>(), {
  header: () => [],
});

const headerBlocks = computed({
  get: () => props.header ?? [],
  set: () => {},
});

const { isInEditor, shouldShowEditorUI } = useEditorState();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { isClicked, clickedBlockIndex, isTablet, tabletEdit, changeBlockPosition, handleDragStart, handleDragEnd } =
  useBlockManager();

const enabledActions = computed(() => shouldShowEditorUI.value && !localizationDrawerOpen.value);

onMounted(async () => {
  if (isInEditor.value) {
    await import('~/components/EditablePage/draggable.css');
  }
});

// eslint-disable-next-line no-console
console.log('🎯 EditableHeader - Rendering header blocks:', props.header?.length ?? 0);
</script>
