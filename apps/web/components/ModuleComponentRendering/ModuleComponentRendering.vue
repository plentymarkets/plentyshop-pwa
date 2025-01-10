<template>
  <component v-for="(component, index) in components" :is="component" :key="index" />
</template>

<script setup lang="ts">
import { ModuleComponentRenderingProps } from './types';

const { area } = defineProps<ModuleComponentRenderingProps>();
const { components } = useModuleRendering(area);
</script>
