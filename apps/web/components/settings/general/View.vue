<template>
  <SiteConfigurationView>
    <template #setting-title> General Settings </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp();

$registerMessages({
  en: { general: 'General Settings', 'customer-management': 'Customer Management' },
  de: { general: 'General Settings', 'customer-management': 'Customer Management' },
});
</script>
