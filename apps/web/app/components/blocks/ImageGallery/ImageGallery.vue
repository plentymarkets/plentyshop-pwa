<template>
  <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
    <Gallery
      :images="addModernImageExtensionForGallery(productGetters.getGallery(currentProduct))"
      :configuration="content"
    />
  </section>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ImageGalleryProps } from '~/components/blocks/ImageGallery/types';

const { addModernImageExtensionForGallery } = useModernImage();

defineProps<ImageGalleryProps>();
const { currentProduct } = useProducts();
</script>
