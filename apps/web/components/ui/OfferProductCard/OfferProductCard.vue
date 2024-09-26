<template>
  <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
    <SfLink :tag="NuxtLink" :to="'#'" class="flex items-center justify-center">
      <NuxtImg
        ref="img"
        :src="'/images/placeholder.png'"
        :alt="'name placeholder'"
        width="300"
        height="300"
        loading="lazy"
        class="w-full h-auto border rounded-md border-neutral-200"
      />
    </SfLink>
  </div>
</template>

<script setup lang="ts">
import { SfLink } from '@storefront-ui/vue';
import { OfferProductCardProps } from './types';

defineProps<OfferProductCardProps>();
const NuxtLink = resolveComponent('NuxtLink');
</script>
