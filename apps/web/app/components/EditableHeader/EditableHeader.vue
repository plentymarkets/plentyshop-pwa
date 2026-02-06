<template>
  <div data-testid="editable-header">
    <PageBlock
      v-for="(block, index) in props.header"
      :key="block.meta?.uuid"
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
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';

interface EditableHeaderProps {
  header?: Block[];
}

const props = withDefaults(defineProps<EditableHeaderProps>(), {
  header: () => [],
});

const { shouldShowEditorUI } = useEditorState();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { isClicked, clickedBlockIndex, isTablet, tabletEdit, changeBlockPosition } = useBlockManager();

const enabledActions = computed(() => shouldShowEditorUI.value && !localizationDrawerOpen.value);

// eslint-disable-next-line no-console
console.log('🎯 EditableHeader - Header blocks:', props.header?.length ?? 0);
</script>
