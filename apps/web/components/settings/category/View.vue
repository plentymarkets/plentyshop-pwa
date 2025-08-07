<template>
  <SiteConfigurationView>
    <template #setting-title> Category Settings </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp();

$registerMessages({
  en: { category: 'Category Settings', sorting: 'Sorting' },
  de: { category: 'Category Settings', sorting: 'Sorting' },
});
</script>
