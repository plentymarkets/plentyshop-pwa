<script setup lang="ts">
import extensionConfig from '../extension.config';
</script>

<template>
  <ExtensionBoundary :name="extensionConfig.name">
    <div data-testid="hello-world">Hello World</div>
  </ExtensionBoundary>
</template>
