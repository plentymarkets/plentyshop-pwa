<template>
  <div data-testid="header-container">
    <div v-for="contentBlock in content" :key="contentBlock.meta.uuid">
      <slot name="content" :content-block="contentBlock" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerProps } from '~/components/blocks/structure/HeaderContainer/types';

const { content } = defineProps<HeaderContainerProps>();
</script>
