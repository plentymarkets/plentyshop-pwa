<template>
  <NarrowContainer>
    <div class="mb-20 px-4 md:px-0" data-testid="wishlist-layout">
      <HeaderWithLink
        v-if="withHeader && title"
        :heading="title"
        :label-desktop="$t('back')"
        :label-mobile="$t('back')"
      />
      <div v-if="products && products.length > 0" data-testid="wishlist-page-content">
        <div class="flex-1">
          <section
            class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 mb-10 md:mb-5"
            data-testid="wishlist-grid"
          >
            <NuxtLazyHydrate when-visible v-for="(product, index) in products" :key="productGetters.getId(product)">
              <UiProductCard
                :product="product"
                is-from-wishlist
                :name="productGetters.getName(product) ?? ''"
                :rating-count="productGetters.getTotalReviews(product)"
                :rating="productGetters.getAverageRating(product)"
                :price="actualPrice(product)"
                :image-url="addWebpExtension(productGetters.getMiddleImage(product))"
                :image-alt="productGetters.getName(product) ?? ''"
                :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
                :priority="index === 0"
                :base-price="productGetters.getDefaultBaseSinglePrice(product)"
                :unit-content="productGetters.getUnitContent(product)"
                :unit-name="productGetters.getUnitName(product)"
                :show-base-price="productGetters.showPricePerUnit(product)"
              >
                <template #wishlistButton>
                  <WishlistButton discard square class="absolute top-0 right-0 mr-2 mt-2 bg-white" :product="product" />
                </template>
              </UiProductCard>
            </NuxtLazyHydrate>
          </section>
        </div>
      </div>
      <div v-else class="flex items-center justify-center flex-col pt-24 pb-32" data-testid="wishlist-page-content">
        <NuxtImg
          data-testid="empty-wishlist-image"
          src="/images/empty-cart.svg"
          :alt="$t('emptyCartImgAlt')"
          width="192"
          height="192"
        />
        <h2 data-testid="empty-wishlist-text" class="mt-8 typography-headline-3 font-bold">
          {{ $t('emptyWishlist') }}
        </h2>
      </div>
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-sdk';
import { WishlistPageContentProps } from '~/components/WishlistPageContent/types';

withDefaults(defineProps<WishlistPageContentProps>(), {
  withHeader: true,
});

const { addWebpExtension } = useImageUrl();

const actualPrice = (product: Product): number => {
  const price = productGetters.getPrice(product);
  if (!price) return 0;

  if (price.special) return price.special;
  if (price.regular) return price.regular;

  return 0;
};
</script>
