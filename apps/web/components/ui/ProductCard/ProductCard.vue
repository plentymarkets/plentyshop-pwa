<template>
  <div class="border border-neutral-200 rounded-md hover:shadow-lg flex-auto flex-shrink-0" data-testid="product-card">
    <div class="relative">
      <SfLink :tag="NuxtLink" :to="`${paths.product}${slug}`">
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          class="object-cover rounded-md aspect-square w-full h-full"
          data-testid="image-slot"
          width="190"
          height="190"
          :loading="lazy && !priority ? 'lazy' : undefined"
          :fetchpriority="priority ? 'high' : undefined"
          :preload="priority"
          format="webp"
        />
      </SfLink>
    </div>
    <div class="p-2 border-t border-neutral-200 typography-text-sm">
      <SfLink :tag="NuxtLink" :to="`${paths.product}${slug}`" class="no-underline" variant="secondary">
        {{ name }}
      </SfLink>
      <div class="flex items-center pt-1">
        <!-- <SfRating size="xs" :value="rating ?? 0" :max="5" />
        <SfLink to="#" variant="secondary" :tag="NuxtLink" class="ml-1 no-underline">
          <SfCounter size="xs">{{ ratingCount }}</SfCounter>
        </SfLink> -->
      </div>
      <p class="block py-2 font-normal typography-text-xs text-neutral-700 text-justify">
        {{ description }}
      </p>
      <div class="flex items-center">
        <span class="block pb-2 font-bold typography-text-sm" data-testid="product-card-vertical-price">
          {{ $n(price, 'currency') }}
        </span>
        <span
          v-if="productGetters.getPrice(product)?.special && productGetters.getRegularPrice(product) > 0"
          class="text-base font-normal text-neutral-500 line-through ml-3 pb-2"
        >
          {{ $n(productGetters.getRegularPrice(product), 'currency') }}
        </span>
      </div>
      <span class="block pb-2 font-bold typography-text-sm" data-testid="product-card-vertical-price">
        {{ $n(price, 'currency') }}
      </span>
      <div v-if="showBasePrice" class="mb-2">
        <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
      </div>
      <SfButton
        type="button"
        size="sm"
        class="min-w-[80px]"
        @click="addWithLoader(Number(productGetters.getId(product)))"
        :disabled="loading"
      >
        <template #prefix v-if="!loading">
          <SfIconShoppingCart size="sm" />
        </template>
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('addToCartShort') }}
        </span>
      </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfLink, SfButton, SfIconShoppingCart, SfLoaderCircular } from '@storefront-ui/vue';
import type { ProductCardProps } from '~/components/ui/ProductCard/types';

withDefaults(defineProps<ProductCardProps>(), {
  lazy: true,
  imageAlt: '',
});

const { addToCart } = useCart();
const loading = ref(false);

const addWithLoader = async (productId: number) => {
  loading.value = true;

  try {
    await addToCart({
      productId: productId,
      quantity: 1,
    });
  } finally {
    loading.value = false;
  }
};

const NuxtLink = resolveComponent('NuxtLink');
</script>
