<template>
  <div data-testid="editable-footer">
    <draggable
      v-if="props.footer && props.footer.length > 0"
      v-model="footerBlocks"
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

interface EditableFooterProps {
  footer?: Block[];
}

const props = withDefaults(defineProps<EditableFooterProps>(), {
  footer: () => [],
});

const footerBlocks = computed({
  get: () => props.footer ?? [],
  set: () => {},
});

const { isInEditor, shouldShowEditorUI } = useEditorState();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { isClicked, clickedBlockIndex, isTablet, tabletEdit, changeBlockPosition, handleDragStart, handleDragEnd } =
  useBlockManager();

const enabledActions = computed(() => shouldShowEditorUI.value && !localizationDrawerOpen.value);

onMounted(async () => {
  if (isInEditor.value) await import('../EditableMain/draggable.css');
});
</script>
