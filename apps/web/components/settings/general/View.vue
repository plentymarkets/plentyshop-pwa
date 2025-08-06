<template>
  <SiteConfigurationView>
    <template #setting-title> General Settings </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp();

$registerMessages({
  en: { 'customer-management': 'Customer Management' },
  de: { 'customer-management': 'Customer Management' },
});
</script>
