<template>
  <div v-if="showNewFeature">New feature is ON</div>
  <div v-else>New feature is OFF</div>
</template>

<script lang="ts" setup>
const { isEnabled } = useFeatureFlag();
const showNewFeature = isEnabled('new-feature-enabled');
</script>
