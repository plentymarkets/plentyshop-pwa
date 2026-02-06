<template>
  <div data-testid="editable-footer">
    <PageBlock
      v-for="(block, index) in props.footer"
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

interface EditableFooterProps {
  footer?: Block[];
}

const props = withDefaults(defineProps<EditableFooterProps>(), {
  footer: () => [],
});

const { shouldShowEditorUI } = useEditorState();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { isClicked, clickedBlockIndex, isTablet, tabletEdit, changeBlockPosition } = useBlockManager();

const enabledActions = computed(() => shouldShowEditorUI.value && !localizationDrawerOpen.value);

// eslint-disable-next-line no-console
console.log('🦶 EditableFooter - Rendering footer blocks:', props.footer?.length ?? 0);
</script>
