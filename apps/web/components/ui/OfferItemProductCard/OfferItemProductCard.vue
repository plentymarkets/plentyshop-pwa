<template v-for="(item, index) in props.offer.order.orderItems" :key="index">
  <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
    <SfLink :tag="NuxtLink" :to="offer.itemURLs[index]" class="flex items-center justify-center">
      <NuxtImg
        ref="img"
        :src="offer.itemImages[index] || '/images/placeholder.png'"
        :alt="'name placeholder'"
        width="300"
        height="300"
        loading="lazy"
        class="w-full h-auto border rounded-md border-neutral-200"
      />
      <!-- <SfLoaderCircular v-if="!imageLoaded" class="absolute" size="sm" /> -->
    </SfLink>
  </div>
</template>

<script setup lang="ts">
import { OfferItemProductVardProps } from './types';

const props = defineProps<OfferItemProductVardProps>();
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
</script>
