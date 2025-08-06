<template>
  <SiteConfigurationView>
    <template #setting-title> Settings </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp()

$registerMessages({
  en: { 'branding-and-design': 'Branding & Design' },
  de: { 'branding-and-design': 'Branding & Design' }
})
</script>
