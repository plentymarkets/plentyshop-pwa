<template>
  <picture>
    <img id="logo" :src="imagePath" alt="Header Logo" style="object-fit: contain" />
  </picture>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();
const imagePath = '/images/logo.' + imageExtension;

if (process.client) {
  const setLogoDimensions = (img: HTMLImageElement) => {
    const intrinsicWidth = img.width;
    const intrinsicHeight = img.height;
    const aspectRatio = intrinsicWidth / intrinsicHeight;

    console.log(`Aspect Ratio: ${aspectRatio}`);

    // Desired width logic
    const desiredWidth = aspectRatio > 1.5 ? 250 : 150;
    const newHeight = desiredWidth / aspectRatio;

    console.log(`Original Width: ${intrinsicWidth}, Original Height: ${intrinsicHeight}`);
    console.log(`New Width: ${desiredWidth}, New Height: ${newHeight}`);

    // Apply dimensions to the logo element
    const logoElement = document.getElementById('logo');
    if (logoElement) {
      logoElement.style.width = `${desiredWidth}px`;
      logoElement.style.height = `${newHeight}px`;
    }
  };

  onMounted(() => {
    const img = new Image();
    img.src = imagePath;

    img.onload = () => setLogoDimensions(img);
  });
}
</script>
