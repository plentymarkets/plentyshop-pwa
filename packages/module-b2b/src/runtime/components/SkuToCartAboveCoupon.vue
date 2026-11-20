<script setup lang="ts">
import { useSkuToCartPosition } from '../composables/useSkuToCartPosition';

const { position } = useSkuToCartPosition();
</script>

<template>
  <SkuToCart v-if="position === 'aboveCoupon'" />
</template>
