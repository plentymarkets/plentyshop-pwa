<template>
  <picture>
    <NuxtImg :src="imagePath" class="w-100 h-10 py-2" width="150" height="40" preload />
  </picture>
</template>

<script setup lang="ts">
const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();
const imagePath = '/images/logo.' + imageExtension;
</script>
