<template>
  <SiteConfigurationView>
    <template #setting-title> Item Settings </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp();

$registerMessages({
  en: { item: 'Item' },
  de: { item: 'Item' },
});
</script>
