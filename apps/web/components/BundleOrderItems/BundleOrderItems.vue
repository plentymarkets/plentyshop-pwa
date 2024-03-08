<template>
    <div v-if="product.bundleComponents" class="border-t-2 my-2">
        <div v-for="(item, index) in product.bundleComponents" :key="index" class="border-b-2 flex py-1">
            <img :src="productBundleGetters.getBundleItemImage(item)" class="h-[112px] w-[112px] pr-2" ref="image">
            <div class="h-24">
                <p>
                    {{ productBundleGetters.getBundleItemQuantity(item) }}x <span class="underline px-1 h-">{{ productBundleGetters.getBundleItemName(item) }}</span>
                </p>
                <p class="h-auto line-clamp-3">{{ productBundleGetters.getBundleItemDescription(item) }}</p>
            </div>
        </div>
    </div>
</template>


  
<script setup lang="ts">
  import { productBundleGetters } from '@plentymarkets/shop-sdk';
  import type { BundleOrderItemsProps } from '~/components/BundleOrderItems/types';

  const { product } = withDefaults(defineProps<BundleOrderItemsProps>(), {});
</script>