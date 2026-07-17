<template>
  <div v-if="product.bundleComponents" class="border-t-2 my-2" data-testid="bundle-components-list">
    <div v-for="(item, index) in product.bundleComponents" :key="index" class="border-b-2 flex py-2">
      <UiLink
        v-if="isLinkable(item)"
        :tag="NuxtLink"
        :to="localePath(productBundleGetters.getBundleItemUrl(item))"
        class="flex-none"
      >
        <NuxtImg
          ref="image"
          :src="addModernImageExtension(productBundleGetters.getBundleItemImage(item))"
          class="size-28 aspect-square object-contain pr-4"
          :alt="productBundleGetters.getBundleItemName(item)"
          loading="lazy"
        />
      </UiLink>

      <NuxtImg
        v-else
        ref="image"
        :src="addModernImageExtension(productBundleGetters.getBundleItemImage(item))"
        class="size-28 aspect-square mr-4 object-contain"
        :alt="productBundleGetters.getBundleItemName(item)"
        loading="lazy"
      />

      <div class="h-24 self-center">
        <div class="inline-flex font-medium typography-text-sm">
          <div class="mr-1">{{ productBundleGetters.getBundleItemQuantity(item) }} x</div>
          <UiLink
            v-if="isLinkable(item)"
            :tag="NuxtLink"
            :to="localePath(productBundleGetters.getBundleItemUrl(item))"
            variant="secondary"
          >
            {{ productBundleGetters.getBundleItemName(item) }}
          </UiLink>
          <span v-else>{{ productBundleGetters.getBundleItemName(item) }}</span>
        </div>

        <div
          v-if="productBundleGetters.getBundleItemShortDescription(item)"
          class="h-auto line-clamp-3 mt-1 font-normal typography-text-sm no-preflight"
          v-html="productBundleGetters.getBundleItemShortDescription(item)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProductBundleComponent, productBundleGetters } from '@plentymarkets/shop-api';
import type { BundleOrderItemsProps } from '~/components/BundleOrderItems/types';

const { product } = defineProps<BundleOrderItemsProps>();
const NuxtLink = resolveComponent('NuxtLink');
const { addModernImageExtension } = useModernImage();
const localePath = useLocalizedPath();

const isLinkable = (item: ProductBundleComponent): boolean => {
  return (
    productBundleGetters.isItemBundleSalable(item) &&
    !productBundleGetters.getBundleItemUrl(item).includes('null') &&
    productBundleGetters.getBundleItemName(item).length > 0
  );
};
</script>
