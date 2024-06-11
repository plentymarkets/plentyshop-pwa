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
          :src="productBundleGetters.getBundleItemImage(item)"
          class="size-28 aspect-square object-contain pr-4"
          ref="image"
          :alt="productBundleGetters.getBundleItemName(item)"
          loading="lazy"
        />
      </SfLink>

      <NuxtImg
        v-else
        :src="productBundleGetters.getBundleItemImage(item)"
        class="size-28 aspect-square mr-4 object-contain"
        ref="image"
        :alt="productBundleGetters.getBundleItemName(item)"
        loading="lazy"
      />

      <div class="h-24 self-center" v-if="isLinkable(item)">
        <div class="inline-flex font-medium typography-text-sm">
          <div class="mr-1">{{ productBundleGetters.getBundleItemQuantity(item) }} x</div>
          <SfLink :tag="NuxtLink" :to="localePath(productBundleGetters.getBundleItemUrl(item))" variant="secondary">
            {{ productBundleGetters.getBundleItemName(item) }}
          </SfLink>
        </div>

        <div
          class="h-auto line-clamp-3 mt-1 font-normal typography-text-sm"
          v-html="productBundleGetters.getBundleItemDescription(item)"
        ></div>
      </div>
      <div v-else>
        <p class="font-medium text-sm">
          {{ productBundleGetters.getBundleItemQuantity(item) }}x
          <span class="h-auto">{{ t('products') }}</span>
        </p>
        <div
          class="h-auto mt-1 font-normal typography-text-sm"
          v-html="t('productAttributes.productInformationMissing')"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProductBundleComponent, productBundleGetters } from '@plentymarkets/shop-api';
import type { BundleOrderItemsProps } from '~/components/BundleOrderItems/types';
import { SfLink } from '@storefront-ui/vue';
const { t } = useI18n();

const { product } = withDefaults(defineProps<BundleOrderItemsProps>(), {});
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
