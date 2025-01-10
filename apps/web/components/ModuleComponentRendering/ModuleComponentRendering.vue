<template>
  <component :is="component" v-for="(component, index) in components" :key="index" />
</template>

<script setup lang="ts">
import type { ModuleComponentRenderingProps } from './types';

const { area } = defineProps<ModuleComponentRenderingProps>();
const { components } = useModuleRendering(area);
</script>
