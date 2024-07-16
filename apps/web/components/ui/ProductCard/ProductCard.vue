<template>
  <div class="border border-neutral-200 rounded-md hover:shadow-lg flex flex-col" data-testid="product-card">
    <div class="relative overflow-hidden">
      <UiBadges
        :class="['absolute', isFromWishlist ? 'mx-2' : 'm-2']"
        :product="product"
        :use-availability="isFromWishlist"
      />

      <SfLink
        :tag="NuxtLink"
        rel="preload"
        :to="productPath"
        :class="{ 'size-48': isFromSlider }"
        as="image"
        class="flex items-center justify-center"
      >
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          :loading="lazy && !priority ? 'lazy' : 'eager'"
          :fetchpriority="priority ? 'high' : 'auto'"
          :preload="priority || false"
          :width="imageWidth"
          :height="imageHeight"
          @load="trackImageLoading"
          class="object-contain rounded-md aspect-square w-full"
          data-testid="image-slot"
        />
        <SfLoaderCircular v-if="!imageLoaded" class="absolute" size="sm" />
      </SfLink>

      <slot name="wishlistButton">
        <WishlistButton
          square
          class="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full"
          :product="product"
        />
      </slot>
    </div>
    <div class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col flex-auto">
      <SfLink :tag="NuxtLink" :to="productPath" class="no-underline" variant="secondary">
        {{ name }}
      </SfLink>
      <div class="flex items-center pt-1 gap-1" :class="{ 'mb-2': !productGetters.getShortDescription(product) }">
        <SfRating size="xs" :half-increment="true" :value="rating ?? 0" :max="5" />
        <SfCounter size="xs">{{ ratingCount }}</SfCounter>
      </div>
      <div
        v-if="productGetters.getShortDescription(product)"
        class="block py-2 font-normal typography-text-xs text-neutral-700 text-justify whitespace-pre-line break-words"
      >
        <span class="line-clamp-3">
          {{ productGetters.getShortDescription(product) }}
        </span>
      </div>
      <LowestPrice :product="product" />
      <div v-if="showBasePrice" class="mb-2">
        <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
      </div>
      <div class="flex flex-col-reverse items-start md:flex-row md:items-center mt-auto">
        <span class="block pb-2 font-bold typography-text-sm" data-testid="product-card-vertical-price">
          <span v-if="!productGetters.canBeAddedToCartFromCategoryPage(product)" class="mr-1">
            {{ t('account.ordersAndReturns.orderDetails.priceFrom') }}
          </span>
          <span>{{ n(cheapestPrice ?? mainPrice, 'currency') }}</span>
          <span v-if="showNetPrices">{{ t('asterisk') }} </span>
        </span>
        <span
          v-if="oldPrice && oldPrice !== mainPrice"
          class="typography-text-sm text-neutral-500 line-through md:ml-3 md:pb-2"
        >
          {{ n(oldPrice, 'currency') }}
        </span>
      </div>
      <SfButton
        v-if="productGetters.canBeAddedToCartFromCategoryPage(product)"
        size="sm"
        class="min-w-[80px] w-fit"
        data-testid="add-to-basket-short"
        @click="addWithLoader(Number(productGetters.getId(product)))"
        :disabled="loading"
      >
        <template #prefix v-if="!loading">
          <SfIconShoppingCart size="sm" />
        </template>
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ t('addToCartShort') }}
        </span>
      </SfButton>
      <SfButton v-else type="button" :tag="NuxtLink" :to="productPath" size="sm" class="w-fit">
        <span>{{ t('showOptions') }}</span>
      </SfButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CategoryTreeItem, productGetters } from '@plentymarkets/shop-api';
import { SfLink, SfButton, SfIconShoppingCart, SfLoaderCircular, SfRating, SfCounter } from '@storefront-ui/vue';
import type { ProductCardProps } from '~/components/ui/ProductCard/types';

const localePath = useLocalePath();
const { t, n } = useI18n();
const {
  product,
  name,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  rating,
  ratingCount,
  priority,
  lazy,
  unitContent,
  unitName,
  basePrice,
  showBasePrice,
  isFromWishlist,
  isFromSlider,
} = withDefaults(defineProps<ProductCardProps>(), {
  lazy: true,
  imageAlt: '',
  isFromWishlist: false,
  isFromSlider: false,
});

const { data: categoryTree } = useCategoryTree();
const { openQuickCheckout } = useQuickCheckout();
const { addToCart } = useCart();
const { send } = useNotification();
const loading = ref(false);
const imageLoaded = ref(false);
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;
const productPath = ref('');
const setProductPath = (categoriesTree: CategoryTreeItem[]) => {
  const path = productGetters.getCategoryUrlPath(product, categoriesTree);
  const productSlug = productGetters.getSlug(product) + `_${productGetters.getItemId(product)}`;
  productPath.value = localePath(`${path}/${productSlug}`);
};

onNuxtReady(() => setProductPath(categoryTree.value));

const trackImageLoading = (event: Event) => {
  const imgElement = event.target as HTMLImageElement;
  if (imgElement?.complete) imageLoaded.value = true;
};

const addWithLoader = async (productId: number) => {
  loading.value = true;

  try {
    await addToCart({
      productId: productId,
      quantity: 1,
    });

    openQuickCheckout(product, 1);
    send({ message: t('addedToCart'), type: 'positive' });
  } finally {
    loading.value = false;
  }
};

const mainPrice = computed(() => {
  const price = productGetters.getPrice(product);
  if (!price) return 0;

  if (price.special) return price.special;
  if (price.regular) return price.regular;

  return 0;
});

const cheapestPrice = productGetters.getCheapestGraduatedPrice(product);
const oldPrice = productGetters.getRegularPrice(product);
const NuxtLink = resolveComponent('NuxtLink');

watch(
  () => categoryTree.value,
  (categoriesTree) => setProductPath(categoriesTree),
);
</script>
