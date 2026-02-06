<template>
  <section class="grid-in-left-top md:h-full">
    <UiPurchaseCard :product="currentProduct" :configuration="content" />
  </section>
</template>

<script setup lang="ts">
import type { PriceCardProps } from '~/components/blocks/PriceCard/types';

defineProps<PriceCardProps>();
const { currentProduct } = useProducts();
</script>
