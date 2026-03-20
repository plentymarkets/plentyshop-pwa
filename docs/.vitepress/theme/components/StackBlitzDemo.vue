<script setup lang="ts">
import { onMounted, ref } from 'vue';
import sdk from '@stackblitz/sdk';

const props = defineProps<{
  projectId?: string;
  files?: Record<string, string>;
  title?: string;
  openFile?: string;
  height?: number;
  hideExplorer?: boolean;
  hideNavigation?: boolean;
  view?: 'preview' | 'editor' | 'default';
}>();

const container = ref<HTMLDivElement>();

onMounted(() => {
  if (!container.value) return;

  const embedOptions = {
    openFile: props.openFile,
    view: props.view || 'default',
    height: props.height || 500,
    hideExplorer: props.hideExplorer,
    hideNavigation: props.hideNavigation,
  };

  if (props.projectId) {
    // Embed existing StackBlitz project
    sdk.embedProjectId(container.value, props.projectId, embedOptions);
  } else if (props.files) {
    // Embed project from file definitions
    sdk.embedProject(
      container.value,
      {
        title: props.title || 'Nuxt Module Example',
        description: 'Interactive Nuxt Module Demo',
        template: 'node',
        files: props.files,
      },
      embedOptions,
    );
  }
});
</script>

<template>
  <div ref="container" class="stackblitz-demo"></div>
</template>

<style scoped>
.stackblitz-demo {
  width: 100%;
  min-height: v-bind(height + 'px');
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}
</style>
