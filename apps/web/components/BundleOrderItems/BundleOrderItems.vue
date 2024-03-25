<template>
  <div v-if="product.bundleComponents" class="border-t-2 my-2">
    <div v-for="(item, index) in product.bundleComponents" :key="index" class="border-b-2 flex py-2">
      <img
        :src="productBundleGetters.getBundleItemImage(item)"
        class="size-28 aspect-square mr-4 object-contain"
        ref="image"
        :alt="productBundleGetters.getBundleItemName(item)"
      />
      <div class="h-24 self-center">
        <SfLink
          :tag="NuxtLink"
          v-if="productBundleGetters.isItemBundleSalable(item)"
          :to="localePath(productBundleGetters.getBundleItemUrl(item))"
          variant="secondary"
          class="no-underline typography-text-sm"
        >
          <p class="font-medium">
            {{ productBundleGetters.getBundleItemQuantity(item) }}x
            <span class="underline h-auto">{{ productBundleGetters.getBundleItemName(item) }}</span>
          </p>
        </SfLink>
        <p class="font-medium text-sm" v-else>
          {{ productBundleGetters.getBundleItemQuantity(item) }}x
          <span class="h-auto">{{ productBundleGetters.getBundleItemName(item) }}</span>
        </p>
        <div
          class="h-auto line-clamp-3 mt-1 font-normal typography-text-sm"
          v-html="productBundleGetters.getBundleItemDescription(item)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productBundleGetters } from '@plentymarkets/shop-sdk';
import type { BundleOrderItemsProps } from '~/components/BundleOrderItems/types';
import { SfLink } from '@storefront-ui/vue';

const { product } = withDefaults(defineProps<BundleOrderItemsProps>(), {});
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
</script>
