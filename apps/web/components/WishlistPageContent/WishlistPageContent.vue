<template>
  <NarrowContainer class="mb-20 px-4 md:px-0" data-testid="wishlist-layout">
    <HeaderWithLink
      v-if="withHeader && title"
      :heading="title"
      :label-desktop="$t('back')"
      :label-mobile="$t('back')"
    />

    <div
      v-if="products.length > 0"
      :class="{ 'pointer-events-none opacity-50': loading }"
      data-testid="wishlist-page-content"
    >
      <SfLoaderCircular v-if="loading" class="absolute left-0 right-0 top-1/3 mx-auto z-[99999]" size="2xl" />
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
            :rating="productGetters.getAverageRating(product, 'half')"
            :price="actualPrice(product)"
            :image-url="addModernImageExtension(getImageForViewport(product, 'Wishlist'))"
            :image-alt="productGetters.getName(product) ?? ''"
            :image-height="productGetters.getImageHeight(product) ?? 600"
            :image-width="productGetters.getImageWidth(product) ?? 600"
            :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
            :priority="index < 5"
            :base-price="productGetters.getDefaultBaseSinglePrice(product)"
            :unit-content="productGetters.getUnitContent(product)"
            :unit-name="productGetters.getUnitName(product)"
            :show-base-price="productGetters.showPricePerUnit(product)"
          >
            <template #wishlistButton>
              <WishlistButton discard square class="absolute top-0 right-0 mr-2 mb-2 bg-white" :product="product" />
            </template>
          </UiProductCard>
        </NuxtLazyHydrate>
      </section>
    </div>

    <div
      v-else
      class="flex items-center justify-center flex-col py-24"
      :class="{ 'pointer-events-none opacity-50': loading }"
      data-testid="wishlist-page-content"
    >
      <SfLoaderCircular v-if="loading" class="absolute z-[99999]" size="2xl" />
      <h2 data-testid="empty-wishlist-text" class="typography-headline-3 font-bold">
        {{ $t('emptyWishlist') }}
      </h2>
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { type Product, productGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { WishlistPageContentProps } from '~/components/WishlistPageContent/types';

withDefaults(defineProps<WishlistPageContentProps>(), { withHeader: true });

const { addModernImageExtension, getImageForViewport } = useModernImage();
const { fetchWishlist, data: products, loading } = useWishlist();

const actualPrice = (product: Product): number => {
  const price = productGetters.getPrice(product);
  if (!price) return 0;
  if (price.special) return price.special;
  if (price.regular) return price.regular;
  return 0;
};

fetchWishlist();
</script>
