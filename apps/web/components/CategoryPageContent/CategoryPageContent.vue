<template>
  <NarrowContainer>
    <div class="mb-20 px-4 md:px-0" data-testid="category-layout">
      <h1 class="my-10 font-bold typography-headline-3 md:typography-headline-2">{{ title }}</h1>
      <div class="md:flex gap-6" data-testid="category-page-content">
        <CategorySidebar :is-open="isOpen" @close="close">
          <NuxtLazyHydrate when-visible>
            <slot name="sidebar" />
          </NuxtLazyHydrate>
        </CategorySidebar>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold font-headings md:text-lg">
              {{ $t('numberOfProducts', { count: products?.length ?? 0, total: totalProducts }) }}
            </span>
            <SfButton @click="open" variant="tertiary" class="md:hidden whitespace-nowrap">
              <template #prefix>
                <SfIconTune />
              </template>
              {{ $t('listSettings') }}
            </SfButton>
          </div>
          <section
            v-if="products"
            class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 mb-10 md:mb-5"
            data-testid="category-grid"
          >
            <NuxtLazyHydrate when-visible v-for="(product, index) in products" :key="productGetters.getId(product)">
              <UiProductCard
                :product="product"
                :name="productGetters.getName(product) ?? ''"
                :rating-count="productGetters.getTotalReviews({} as ReviewAverage)"
                :rating="productGetters.getAverageRating({} as ReviewAverage)"
                :price="productGetters.getPrice(product)?.special ?? productGetters.getPrice(product)?.regular ?? 0"
                :image-url="productGetters.getCoverImage(product)"
                :image-alt="productGetters.getName(product) ?? ''"
                :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
                :priority="index === 0"
                :base-price="productGetters.getDefaultBasePrice(product)"
                :unit-content="productGetters.getUnitContent(product)"
                :unit-name="productGetters.getUnitName(product)"
                :show-base-price="productGetters.showPricePerUnit(product)"
              />
            </NuxtLazyHydrate>
          </section>
          <LazyCategoryEmptyState v-else />
          <NuxtLazyHydrate when-visible>
            <UiPagination
              v-if="totalProducts > 0"
              :current-page="getFacetsFromURL().page ?? 1"
              :total-items="totalProducts"
              :page-size="itemsPerPage"
              :max-visible-pages="maxVisiblePages"
            />
          </NuxtLazyHydrate>
        </div>
      </div>
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { ReviewAverage } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfButton, SfIconTune, useDisclosure } from '@storefront-ui/vue';
import { useMediaQuery } from '@vueuse/core';
import type { CategoryPageContentProps } from '~/components/CategoryPageContent/types';

withDefaults(defineProps<CategoryPageContentProps>(), {
  itemsPerPage: 24,
});

const { getFacetsFromURL } = useCategoryFilter();

const { isOpen, open, close } = useDisclosure();
const isTabletScreen = useMediaQuery(mediaQueries.tablet);
const isWideScreen = useMediaQuery(mediaQueries.desktop);
const maxVisiblePages = ref(1);

const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1);

watch(isWideScreen, (value) => setMaxVisiblePages(value));
onMounted(() => setMaxVisiblePages(isWideScreen.value));
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close();
  }
});
</script>
