<template>
  <div data-testid="editable-main">
    <draggable
      v-if="props.main && props.main.length > 0"
      v-model="mainBlocks"
      item-key="meta.uuid"
      handle=".drag-handle"
      class="content"
      :filter="'.no-drag'"
      :prevent-on-filter="false"
      @start="handleDragStart"
      @end="handleDragEnd"
    >
      <template #item="{ element: block, index }">
        <component
          :is="
            (block?.content as any)?.layout?.narrowContainer === false ||
            (block as any)?.layout?.narrowContainer === false
              ? 'div'
              : NarrowContainer
          "
        >
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
        </component>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import draggable from 'vuedraggable/src/vuedraggable';

const NarrowContainer = resolveComponent('NarrowContainer');

interface EditableMainProps {
  main?: Block[];
}

const props = withDefaults(defineProps<EditableMainProps>(), {
  main: () => [],
});

const mainBlocks = computed({
  get: () => props.main ?? [],
  set: () => {},
});

const { isInEditor, shouldShowEditorUI } = useEditorState();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { isClicked, clickedBlockIndex, isTablet, tabletEdit, changeBlockPosition, handleDragStart, handleDragEnd } =
  useBlockManager();

const enabledActions = computed(() => shouldShowEditorUI.value && !localizationDrawerOpen.value);

onMounted(async () => {
  if (isInEditor.value) {
    await import('./draggable.css');
  }
});
</script>
