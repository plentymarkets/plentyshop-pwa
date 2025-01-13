<template>
  <div v-if="product.bundleComponents" class="border-t-2 my-2">
    <div v-for="(item, index) in product.bundleComponents" :key="index" class="border-b-2 flex py-2">
      <SfLink
        v-if="isLinkable(item)"
        :tag="NuxtLink"
        :to="localePath(productBundleGetters.getBundleItemUrl(item))"
        class="flex-none"
      >
        <NuxtImg
          ref="image"
          :src="productBundleGetters.getBundleItemImage(item)"
          class="size-28 aspect-square object-contain pr-4"
          :alt="productBundleGetters.getBundleItemName(item)"
          loading="lazy"
        />
      </SfLink>

      <NuxtImg
        v-else
        ref="image"
        :src="productBundleGetters.getBundleItemImage(item)"
        class="size-28 aspect-square mr-4 object-contain"
        :alt="productBundleGetters.getBundleItemName(item)"
        loading="lazy"
      />

      <div v-if="isLinkable(item)" class="h-24 self-center">
        <div class="inline-flex font-medium typography-text-sm">
          <div class="mr-1">{{ productBundleGetters.getBundleItemQuantity(item) }} x</div>
          <SfLink :tag="NuxtLink" :to="localePath(productBundleGetters.getBundleItemUrl(item))" variant="secondary">
            {{ productBundleGetters.getBundleItemName(item) }}
          </SfLink>
        </div>

        <div
          class="h-auto line-clamp-3 mt-1 font-normal typography-text-sm no-preflight"
          v-html="productBundleGetters.getBundleItemDescription(item)"
        />
      </div>
      <div v-else>
        <p class="font-medium text-sm">
          {{ productBundleGetters.getBundleItemQuantity(item) }} x
          <span class="h-auto">[{{ t('productAttributes.productNameMissing') }}]</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProductBundleComponent, productBundleGetters } from '@plentymarkets/shop-api';
import type { BundleOrderItemsProps } from '~/components/BundleOrderItems/types';
import { SfLink } from '@storefront-ui/vue';
const { t } = useI18n();

const { product } = defineProps<BundleOrderItemsProps>();
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();

const isLinkable = (item: ProductBundleComponent): boolean => {
  return (
    productBundleGetters.isItemBundleSalable(item) &&
    !productBundleGetters.getBundleItemUrl(item).includes('null') &&
    productBundleGetters.getBundleItemName(item).length > 0
  );
};
</script>
