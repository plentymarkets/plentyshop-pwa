<script setup lang="ts">
import extensionConfig from '../extension.config';
</script>

<template>
  <ExtensionBoundary :name="extensionConfig.name">
    <div data-testid="extension-content">Your extension is active.</div>
  </ExtensionBoundary>
</template>
