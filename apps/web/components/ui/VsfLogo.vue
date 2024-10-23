<template>
  <picture>
    <img id="logo" :src="imagePath" alt="Header Logo" style="width: auto; height: auto; object-fit: contain" />
  </picture>
</template>

<!--<script setup lang="ts">-->
<!--const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();-->
<!--const imagePath = '/images/logo.' + imageExtension;-->

<!--if (process.client) {-->
<!--  const img = new Image();-->
<!--  img.src = imagePath;-->

<!--  img.onload = function () {-->
<!--    const width = img.width;-->
<!--    const height = img.height;-->
<!--    console.log(`Width: ${width}, Height: ${height}`);-->
<!--  };-->
<!--}-->
<!--</script>-->

 <script setup lang="ts">
const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();
const imagePath = '/images/logo.' + imageExtension;

if (process.client) {
  const img = new Image();
  img.src = imagePath;

  img.onload = function () {
    const intrinsicWidth = img.width;
    const intrinsicHeight = img.height;
    const aspectRatio = intrinsicWidth / intrinsicHeight;

    // Adjust width based on aspect ratio
    let desiredWidth;
    if (aspectRatio > 1.5) {
      // Wider logos get a smaller width
      desiredWidth = 200;
    } else if (aspectRatio < 1) {
      // Taller logos can take a larger width
      desiredWidth = 150;
    } else {
      // For square-like logos, use the default width
      desiredWidth = 150;
    }

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
}
</script>
