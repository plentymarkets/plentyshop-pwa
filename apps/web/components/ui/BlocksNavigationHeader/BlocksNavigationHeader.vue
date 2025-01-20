<template>
  <div>
    <div>Add block</div>
    <button @click="closeBlocksNav">
      <SfIconClose />
    </button>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
const { displayBlockList } = useEditor();

const closeBlocksNav = () => {
  displayBlockList.value = false;
};
</script>
