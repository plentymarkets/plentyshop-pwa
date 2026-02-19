<template>
  <div
    class="rounded-md hover:shadow-lg flex flex-col"
    data-testid="product-card"
    :class="{ 'border border-neutral-200': configuration?.cardBorders }"
  >
    <div class="relative overflow-hidden">
      <UiBadges
        :use-tags="useTagsOnCategoryPage"
        :class="['absolute', isFromWishlist ? 'mx-2' : 'm-2']"
        :product="product"
        :use-availability="isFromWishlist"
      />

      <SfLink
        :tag="NuxtLink"
        rel="preload"
        :to="productPath"
        :class="[{ 'size-48': isFromSlider }, 'relative group/image flex items-center justify-center']"
        as="image"
      >
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          :title="imageTitle ? imageTitle : null"
          :loading="lazy && !priority ? 'lazy' : 'eager'"
          :fetchpriority="priority ? 'high' : 'auto'"
          :preload="priority || false"
          :width="getWidth()"
          :height="getHeight()"
          :class="[
            'object-contain rounded-md aspect-square w-full transition-opacity duration-300',
            effectiveHoverImageUrl ? 'group-hover/image:opacity-0' : '',
          ]"
          data-testid="image-slot"
        />
        <NuxtImg
          v-if="effectiveHoverImageUrl"
          :src="effectiveHoverImageUrl"
          :alt="imageAlt"
          :title="imageTitle ? imageTitle : null"
          :loading="lazy && !priority ? 'lazy' : 'eager'"
          fetchpriority="auto"
          :preload="false"
          :width="getWidth()"
          :height="getHeight()"
          class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 object-contain rounded-md w-full h-full"
          data-testid="hover-image-slot"
        />
      </SfLink>

      <template v-if="configuration?.showWishlistButton">
        <slot name="wishlistButton">
          <WishlistButton
            square
            class="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full"
            :product="product"
          />
        </slot>
      </template>
    </div>

    <div
      class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col flex-auto"
      :class="{
        'items-center': configuration?.contentAlignment === 'center',
        'items-end': configuration?.contentAlignment === 'right',
        'items-start': configuration?.contentAlignment === 'left',
      }"
    >
      <template v-for="key in configuration?.fieldsOrder" :key="key">
        <template v-if="key === 'title' && configuration?.fields?.title">
          <SfLink
            :tag="NuxtLink"
            :to="productPath"
            class="no-underline"
            variant="secondary"
            data-testid="productcard-name"
          >
            {{ name }}
          </SfLink>
        </template>
        <template v-if="key === 'manufacturer' && configuration?.fields?.manufacturer">
          <div
            v-if="manufacturer"
            class="mb-1 typography-text-xs text-neutral-500"
            data-testid="productcard-manufacturer"
          >
            {{ manufacturer.externalName }}
          </div>
        </template>
        <template v-if="key === 'rating' && configuration?.fields?.rating">
          <div class="flex items-center pt-1 gap-1 mb-2">
            <SfRating size="xs" :half-increment="true" :value="rating ?? 0" :max="5" />
            <SfCounter size="xs">{{ ratingCount }}</SfCounter>
          </div>
        </template>
        <template v-if="key === 'previewText' && configuration?.fields?.previewText">
          <div
            v-if="shortDescription"
            class="block py-2 font-normal typography-text-xs text-neutral-700 text-justify whitespace-pre-line break-words"
          >
            <div class="line-clamp-3" v-html="shortDescription" />
          </div>
        </template>
        <template v-if="key === 'price' && configuration?.fields?.price">
          <LowestPrice :product="product" />
          <div v-if="showBasePrice" class="mb-2">
            <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
          </div>
          <div class="flex flex-col-reverse items-start md:flex-row md:items-center mt-auto">
            <span class="block pb-2 font-bold typography-text-sm" data-testid="product-card-vertical-price">
              <span v-if="showFromText" class="mr-1">{{ t('account.ordersAndReturns.orderDetails.priceFrom') }}</span>
              <span>{{ format(price) }}</span>
              <span>{{ t('common.labels.asterisk') }}</span>
            </span>
            <span
              v-if="crossedPrice && differentPrices(price, crossedPrice)"
              class="typography-text-sm text-neutral-500 line-through md:ml-3 md:pb-2"
            >
              {{ format(crossedPrice) }}
            </span>
          </div>
        </template>
        <template v-if="key === 'addToCart' && configuration?.fields?.addToCart">
          <UiButton
            v-if="canAddFromCategory"
            size="sm"
            class="min-w-[80px] w-fit"
            data-testid="add-to-basket-short"
            :disabled="loading"
            :variant="configuration?.addToCartStyle || 'primary'"
            @click="addWithLoader(Number(productGetters.getId(product)))"
          >
            <template v-if="!loading" #prefix>
              <SfIconShoppingCart size="sm" />
            </template>
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
            <span v-else>{{ t('common.actions.add') }}</span>
          </UiButton>
          <UiButton
            v-else
            :variant="configuration?.addToCartStyle || 'primary'"
            type="button"
            :tag="NuxtLink"
            :to="productPath"
            size="sm"
            class="w-fit"
          >
            <span>{{ t('common.actions.showOptions') }}</span>
          </UiButton>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productImageGetters } from '@plentymarkets/shop-api';
import { SfLink, SfIconShoppingCart, SfLoaderCircular, SfRating, SfCounter } from '@storefront-ui/vue';
import type { ProductCardProps } from '~/components/ui/ProductCard/types';
import { defaults } from '~/composables';
import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';
import type { BasketItemOrderParamsProperty, Product, DoAddItemParams } from '@plentymarkets/shop-api';

const props = withDefaults(defineProps<ProductCardProps>(), {
  configuration: () => ({
    cardBorders: true,
    contentAlignment: 'left',
    fields: {
      title: true,
      rating: true,
      previewText: false,
      price: true,
      addToCart: true,
      manufacturer: false,
    },
    fieldsOrder: ['title', 'manufacturer', 'rating', 'previewText', 'price', 'addToCart'],
    showWishlistButton: false,
    showSecondImageOnHover: false,
    addToCartStyle: 'primary',
    itemsPerRowDesktop: 4,
    itemsPerRowTablet: 3,
    itemsPerRowMobile: 1,
    showItemCount: true,
    itemCountPosition: 'center',
    fieldsDisabled: [],
    paginationPosition: 'bottom',
    layout: {
      fullWidth: false,
    },
  }),
});

const product = computed(() => props.product);

const configuration = computed(() => props.configuration || ({} as ItemGridContent));

const { addModernImageExtension } = useModernImage();
const localePath = useLocalePath();
const { format } = usePriceFormatter();
const { openQuickCheckout } = useQuickCheckout();
const { addToCart } = useCart();
const { price, crossedPrice } = useProductPrice(product.value);
const { send } = useNotification();
const loading = ref(false);
const config = useRuntimeConfig();
const useTagsOnCategoryPage = config.public.useTagsOnCategoryPage;
const name = computed(
  () => productGetters.getName(product.value) + productGetters.getGroupedAttributesString(product.value),
);
const manufacturer = computed(() => productGetters.getManufacturer(product.value));
const ratingCount = computed(() => productGetters.getTotalReviews(product.value));
const rating = computed(() => productGetters.getAverageRating(product.value, 'half'));
const shortDescription = computed(() => productGetters.getShortDescription(product.value) || '');
const autoOrderParams = computed(() => {
  return productGetters.hasOrderPropertiesRequiredAndPreselected(product.value)
    ? buildAutoBasketItemOrderParams(product.value)
    : undefined;
});
const canAddFromCategory = computed(
  () =>
    productGetters.canBeAddedToCartFromCategoryPage(product.value) ||
    productGetters.hasOrderPropertiesRequiredAndPreselected(product.value),
);
const showFromText = computed(() => productGetters.showFromText(product.value));

const cover = computed(() => productGetters.getCoverImage(product.value));
const secondCover = computed(() => productGetters.getSecondCoverImage(product.value));
const firstImage = computed(() => productImageGetters.getFirstImage(product.value));

const imageUrl = computed(() => addModernImageExtension(cover.value));
const effectiveHoverImageUrl = computed(() => {
  if (!configuration.value?.showSecondImageOnHover) return '';
  const src = addModernImageExtension(secondCover.value);
  return src || '';
});

const imageAlt = computed(() => productImageGetters.getImageAlternate(firstImage.value) || name.value || '');
const imageTitle = computed(() => productImageGetters.getImageName(firstImage.value) || '');

const imageWidth = computed(() => productGetters.getImageWidth(product.value) || 600);
const imageHeight = computed(() => productGetters.getImageHeight(product.value) || 600);

const basePrice = computed(() => productGetters.getDefaultBasePrice(product.value));
const unitContent = computed(() => productGetters.getUnitContent(product.value));
const unitName = computed(() => productGetters.getUnitName(product.value));
const showBasePrice = computed(() => productGetters.showPricePerUnit(product.value));

const variationId = computed(() => productGetters.getVariationId(product.value));
const { isGlobalProductCategoryTemplate } = useProducts();
const productPath = computed(() => {
  if (isGlobalProductCategoryTemplate?.value) {
    return paths.globalItemDetails;
  }
  if (config.public.enableCallistoUrlScheme) {
    return `/${productGetters.getUrlPath(product.value)}/a-${productGetters.getItemId(product.value)}`;
  }
  const basePath = `/${productGetters.getUrlPath(product.value)}_${productGetters.getItemId(product.value)}`;
  const shouldAppendVariation = productGetters.shouldAppendVariationToLink(product.value);
  return localePath(shouldAppendVariation ? `${basePath}_${variationId.value}` : basePath);
});

const priority = ref((props.index || 0) < 5);
const lazy = ref(props.lazy || false);
const isFromWishlist = ref(props.isFromWishlist || false);
const isFromSlider = ref(props.isFromSlider || false);

const getWidth = () => {
  if (imageWidth.value && imageWidth.value > 0 && imageUrl.value.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageWidth.value;
  }
  return '';
};

const getHeight = () => {
  if (imageHeight.value && imageHeight.value > 0 && imageUrl.value.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageHeight.value;
  }
  return '';
};

/**
 * Builds basket order parameters for products that have
 * required and preselected order properties.
 *
 * This helper extracts only order properties that are marked as required
 * and converts them into the structure expected by the basket API.
 *
 * It is intended to be used only when the product is already validated
 * by `hasOrderPropertiesRequiredAndPreselected`, meaning no user input
 * is needed before adding the product to the basket.
 *
 * @param product - The product from which order properties are extracted.
 * @returns An array of basket order parameter objects if required order
 *          properties exist, otherwise `undefined`.
 */
const buildAutoBasketItemOrderParams = (product: Product): BasketItemOrderParamsProperty[] | undefined =>
  product.properties
    ?.filter((p) => p?.property?.isOderProperty && p.property.isRequired)
    .map((p) => {
      const pr = p.property;

      return {
        property: {
          id: p.propertyId ?? pr.id,
          names: { name: pr.names?.name ?? '' },
          valueType: pr.valueType,
          value: '1',
        },
      };
    }) || undefined;

const addWithLoader = async (productId: number, quickCheckout = true) => {
  loading.value = true;
  try {
    const isRequiredAndPreselected = productGetters.hasOrderPropertiesRequiredAndPreselected(product.value);
    const params = isRequiredAndPreselected ? autoOrderParams.value : undefined;

    if (isRequiredAndPreselected && !params) {
      await navigateTo(productPath.value);
      return;
    }

    const addToCartObject: DoAddItemParams = {
      productId,
      quantity: 1,
      ...(params ? { basketItemOrderParams: params } : {}),
    };

    await addToCart(addToCartObject);

    if (quickCheckout) openQuickCheckout(product.value, 1);
    else send({ message: t('cart.itemAdded'), type: 'positive' });
  } finally {
    loading.value = false;
  }
};
const differentPrices = (price: number, crossedPrice: number) => {
  return crossedPrice ? Math.round(price * 100) / 100 !== Math.round(crossedPrice * 100) / 100 : false;
};

const NuxtLink = resolveComponent('NuxtLink');
</script>
