<script setup lang="ts">
import extensionConfig from '../extension.config';
import { useSkuToCartPosition } from '../composables/useSkuToCartPosition';

const { position } = useSkuToCartPosition();
</script>

<template>
  <!-- Nothing to collapse next to in an empty cart, so the form is shown directly. -->
  <ExtensionBoundary v-if="position !== 'none'" :name="extensionConfig.name">
    <SkuToCartForm class="mt-6 w-full max-w-2xl" data-testid="sku-to-cart" />
  </ExtensionBoundary>
</template>
