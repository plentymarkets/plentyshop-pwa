<template>
  <EditorFormPanel v-model="settingGroupOpen">
    <template #title>
      <slot name="settings-group-title" />
    </template>
    <slot />
  </EditorFormPanel>
</template>

<script setup lang="ts">
const settingGroupOpen = ref(false);
</script>
