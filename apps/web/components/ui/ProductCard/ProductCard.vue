<template>
  <div class="kl-card-image-zoom rounded-md flex flex-col"
       data-testid="product-card">
    <div class="relative overflow-hidden">
      <SfLink
              :tag="NuxtLink"
              rel="preload"
              :to="productPath"
              :class="{ 'size-48': isFromSlider }"
              as="image"
              class="flex items-center justify-center">
        <NuxtImg
                 :src="imageUrl"
                 :alt="imageAlt"
                 :title="imageTitle"
                 :loading="lazy && !priority ? 'lazy' : 'eager'"
                 :fetchpriority="priority ? 'high' : 'auto'"
                 :preload="priority || false"
                 :width="getWidth()"
                 :height="getHeight()"
                 class="object-contain aspect-square w-full"
                 data-testid="image-slot" />
      </SfLink>

      <slot name="wishlistButton">
        <WishlistButton
                        square
                        class="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full"
                        :product="product" />
      </slot>
    </div>
    <div class="pt-6 typography-text-sm flex flex-col flex-auto">
      <SfLink :tag="NuxtLink" :to="productPath" class="no-underline g-16" variant="secondary">
        {{ name }}
      </SfLink>
      <p class="mb-2">{{ getWeight(product) }}g ({{ n(getKgPrice(product), 'currency') }}/kg )</p>

      <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
      <div class="flex items-center pt-2 gap-1" :class="{ 'mb-2': !productGetters.getShortDescription(product) }">
        <SfRating size="xs" :half-increment="true" :value="rating ?? 0" :max="5" />
        <SfCounter size="xs">{{ ratingCount }}</SfCounter>
      </div>
      <div
           v-if="productGetters.getShortDescription(product)"
           class="block py-2 font-normal typography-text-xs text-neutral-700 text-justify whitespace-pre-line break-words">
        <span class="line-clamp-3">
          <VariationProperties :product="product"></VariationProperties>
          ITEM_ID: {{ product.item.id }}
        </span>
      </div>
      <LowestPrice :product="product" />

      <div class="flex items-center">
        <div class="flex flex-col-reverse items-start md:flex-row md:items-center mt-auto">
          <span class="block font-bold typography-text-sm" data-testid="product-card-vertical-price">
            <span v-if="!productGetters.canBeAddedToCartFromCategoryPage(product)" class="mr-1">
              {{ t('account.ordersAndReturns.orderDetails.priceFrom') }}
            </span>
            <span class="g-24">{{ n(price, 'currency') }}</span>
            <span class="g-24" v-if="showNetPrices">{{ t('asterisk') }} </span>
          </span>
          <span v-if="crossedPrice" class="typography-text-sm text-neutral-500 line-through md:ml-3 g-16-m">
            {{ n(crossedPrice, 'currency') }}
          </span>
        </div>

        <div class="ml-auto">
          <UiButton
                    v-if="productGetters.canBeAddedToCartFromCategoryPage(product)"
                    size="sm"
                    class="min-w-[80px] w-fit"
                    data-testid="add-to-basket-short"
                    @click="addWithLoader(Number(productGetters.getId(product)))"
                    :disabled="loading">
            <template #prefix v-if="!loading">
              <SfIconShoppingCart size="sm" />
            </template>
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ t('addToCartShort') }}
            </span>
          </UiButton>
          <UiButton v-else type="button" :tag="NuxtLink" :to="productPath" size="sm" class="w-fit">
            <span>{{ t('showOptions') }}</span>
          </UiButton>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfLink, SfIconShoppingCart, SfLoaderCircular, SfRating, SfCounter } from '@storefront-ui/vue';
import type { ProductCardProps } from '~/components/ui/ProductCard/types';
import { defaults } from '~/composables';
import { Product } from '@plentymarkets/shop-api';

const localePath = useLocalePath();
const { t, n } = useI18n();
const {
  product,
  name,
  imageUrl,
  imageAlt = '',
  imageTitle,
  imageWidth,
  imageHeight,
  rating,
  ratingCount,
  priority,
  lazy = true,
  unitContent,
  unitName,
  basePrice,
  showBasePrice,
  isFromWishlist = false,
  isFromSlider = false,
} = defineProps<ProductCardProps>();

const { data: categoryTree } = useCategoryTree();
const { openQuickCheckout } = useQuickCheckout();
const { addToCart } = useCart();
const { price, crossedPrice } = useProductPrice(product);
const { send } = useNotification();
const loading = ref(false);
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;
const path = computed(() => productGetters.getCategoryUrlPath(product, categoryTree.value));
const productSlug = computed(() => productGetters.getSlug(product) + `_${productGetters.getItemId(product)}`);
const productPath = computed(() => localePath(`${path.value}/${productSlug.value}`));
const getWidth = () => {
  if (imageWidth && imageWidth > 0 && imageUrl.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageWidth;
  }
  return '';
};
const getHeight = () => {
  if (imageHeight && imageHeight > 0 && imageUrl.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageHeight;
  }
  return '';
};

const addWithLoader = async (productId: number, quickCheckout = true) => {
  loading.value = true;

  try {
    await addToCart({
      productId: productId,
      quantity: 1,
    });
    if (quickCheckout) {
      openQuickCheckout(product, 1);
    } else {
      send({ message: t('addedToCart'), type: 'positive' });
    }
  } finally {
    loading.value = false;
  }
};

const getWeight = (product: Product) => {
  let propertyGroup = product.variationProperties?.find(property => property.id == 8);
  let property: any = propertyGroup?.properties.find(property => property.id == 21);
  if (!property) return false;

  return property.values.value;
}

const getKgPrice = (product: Product) => {
  let weight = getWeight(product);
  let kgPrice = (price.value / weight) * 1000;

  return kgPrice;
}

const NuxtLink = resolveComponent('NuxtLink');
</script>
