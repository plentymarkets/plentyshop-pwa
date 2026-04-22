<template>
  <div :class="headerBlocksClasses">
    <EditableBlocks
      v-if="headerBlock"
      :has-enabled-actions="enableHeaderActionsOnlyForIndex"
      :blocks="[headerBlock]"
      read-only
    />
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerBlock } from '~/components/blocks/structure/HeaderContainer/types';

const { headerContainer } = useBlocks();
const route = useRoute();

const headerBlock = computed(() => headerContainer.value);

const enableHeaderActionsOnlyForIndex = computed(() => {
  return route.meta.identifier === 'index';
});

const headerBlocksClasses = computed(() => [
  'header-blocks',
  { 'sticky top-0 z-50': (headerBlock.value as HeaderContainerBlock | undefined)?.configuration?.layout?.sticky },
]);
</script>
