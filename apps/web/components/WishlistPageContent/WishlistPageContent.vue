<template>
  <NarrowContainer>
    <div class="mb-20 px-4 md:px-0" data-testid="wishlist-layout">
      <ActionableHeader :heading="title" :label-desktop="$t('backToShopping')" :label-mobile="$t('back')" />
      <div data-testid="wishlist-page-content">
        <div class="flex-1">
          <section
            v-if="products"
            class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 mb-10 md:mb-5"
            data-testid="wishlist-grid"
          >
            <NuxtLazyHydrate when-visible v-for="(product, index) in products" :key="productGetters.getId(product)">
              <UiProductCard
                :product="product"
                :name="productGetters.getName(product) ?? ''"
                :rating-count="productGetters.getTotalReviews(product)"
                :rating="productGetters.getAverageRating(product)"
                :price="actualPrice(product)"
                :image-url="addWebpExtension(productGetters.getCoverImagePreview(product))"
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
          <LazyCategoryEmptyState v-else />
        </div>
      </div>
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-sdk';
import type { CategoryPageContentProps } from '~/components/CategoryPageContent/types';
import ActionableHeader from '~/components/ActionableHeader/ActionableHeader.vue';

withDefaults(defineProps<CategoryPageContentProps>(), {
  itemsPerPage: 24,
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
