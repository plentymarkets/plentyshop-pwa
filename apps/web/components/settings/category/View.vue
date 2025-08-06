<template>
  <SiteConfigurationView>
    <template #setting-title> Sorting and Pagination </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp()

$registerMessages({
  en: { 'sorting': 'Sorting' },
  de: { 'sorting': 'Sorting' }
})
</script>
