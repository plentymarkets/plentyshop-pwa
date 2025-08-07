<template>
  <SiteConfigurationView>
    <template #setting-title> Branding & Design</template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp();

$registerMessages({
  en: { 'branding-and-design': 'Branding & Design' },
  de: { 'branding-and-design': 'Branding & Design' },
});
</script>
