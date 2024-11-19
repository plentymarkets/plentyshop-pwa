<template>
  <picture>
    <NuxtImg :src="imagePath" alt="Kellogg's Logo" class="w-100" width="150" height="40" preload />
  </picture>
</template>

<script setup lang="ts">
const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();

const imagePath = '/images/kelloggs-logo.' + imageExtension;
</script>
