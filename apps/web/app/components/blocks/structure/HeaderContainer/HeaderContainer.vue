<template>
  <div data-testid="header-container">
    <PageBlock
      v-for="(childBlock, index) in block.content"
      :key="childBlock.meta.uuid"
      :index="index"
      :block="childBlock"
      :enable-actions="enableActions"
      :is-clicked="isClicked"
      :clicked-block-index="clickedBlockIndex"
      :is-tablet="isTablet"
      :change-block-position="() => {}"
      :root="true"
      class="group"
      @click="tabletEdit(index)"
    />
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerProps } from '~/components/blocks/structure/HeaderContainer/types';

const { block } = defineProps<HeaderContainerProps>();

const { shouldShowEditorUI } = useEditorState();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();
const { isClicked, clickedBlockIndex, isTablet, tabletEdit } = useBlockManager();

const enableActions = computed(() => shouldShowEditorUI.value && !localizationDrawerOpen.value);
</script>
