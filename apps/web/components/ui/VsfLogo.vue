<template>
  <picture>
    <NuxtImg ref="logo" :src="imagePath" alt="plentyShop PWA Logo" class="py-2 w-100 h-auto logoImg img-fluid" />
  </picture>
</template>

<script setup lang="ts">
const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();
const imagePath = '/images/logo.' + imageExtension;

if (process.client) {
  const img = new Image();
  img.src = imagePath;

  img.onload = function () {
    const width = img.width;
    const height = img.height;
    console.log(`Width: ${width}, Height: ${height}`);
  };
}
</script>
