<template>
  <div v-if="product.bundleComponents" class="border-t-2 my-2">
    <div v-for="(item, index) in product.bundleComponents" :key="index" class="border-b-2 flex py-2">
      <NuxtImg
        :src="productBundleGetters.getBundleItemImage(item)"
        class="size-28 aspect-square mr-4 object-contain"
        ref="image"
        :alt="productBundleGetters.getBundleItemName(item)"
        loading="lazy"
      />
      <div class="h-24 self-center" v-if="isLinkable(item)">
        <SfLink
          :tag="NuxtLink"
          :to="localePath(productBundleGetters.getBundleItemUrl(item))"
          variant="secondary"
          class="no-underline typography-text-sm"
        >
          <p class="font-medium">
            {{ productBundleGetters.getBundleItemQuantity(item) }}x
            <span class="underline h-auto" v-html="productBundleGetters.getBundleItemName(item).length > 0 ? productBundleGetters.getBundleItemName(item) : t('productAttributes.productNameMissing')"></span>
          </p>
        </SfLink>
        <div
          class="h-auto line-clamp-3 mt-1 font-normal typography-text-sm"
          v-html="productBundleGetters.getBundleItemDescription(item)"
        ></div>
      </div>
      <div v-else>
        <p class="font-medium text-sm">
          {{ productBundleGetters.getBundleItemQuantity(item) }}x
          <span class="h-auto">[{{ t('productAttributes.productNameMissing') }}]</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productBundleGetters } from '@plentymarkets/shop-sdk';
import { type ProductBundleComponent } from '@plentymarkets/shop-api';
import type { BundleOrderItemsProps } from '~/components/BundleOrderItems/types';
import { SfLink } from '@storefront-ui/vue';
const { t } = useI18n();

const { product } = withDefaults(defineProps<BundleOrderItemsProps>(), {});
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();

const isLinkable = (item: ProductBundleComponent): boolean => {
  return (
    productBundleGetters.isItemBundleSalable(item) && !productBundleGetters.getBundleItemUrl(item).includes('null')
  );
};
</script>
