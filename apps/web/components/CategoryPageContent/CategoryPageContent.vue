<template>
  <NarrowContainer class="mb-20 px-4 md:px-0" data-testid="category-layout">
    <h1 class="my-10 font-bold typography-headline-3 md:typography-headline-2">{{ title }}</h1>
    <div class="md:flex gap-6" data-testid="category-page-content">
      <CategorySidebar :is-open="isOpen" @close="close">
        <NuxtLazyHydrate when-visible>
          <slot name="sidebar" />
        </NuxtLazyHydrate>
      </CategorySidebar>
      <div class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <span class="font-bold md:text-lg">
            {{
              $t('numberOfProducts', {
                count: products?.length ?? 0,
                total: totalProducts,
              })
            }}
          </span>
          <UiButton variant="tertiary" class="md:hidden whitespace-nowrap" @click="open">
            <template #prefix>
              <SfIconTune />
            </template>
            {{ $t('listSettings') }}
          </UiButton>
        </div>
        <section
          v-if="products?.length"
          class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 mb-10 md:mb-5"
          data-testid="category-grid"
        >
          <NuxtLazyHydrate
            v-for="(product, index) in products"
            :key="productGetters.getVariationId(product)"
            when-visible
          >
            <UiProductCard
              :product="product"
              :name="productGetters.getName(product) ?? ''"
              :rating-count="productGetters.getTotalReviews(product)"
              :rating="productGetters.getAverageRating(product, 'half')"
              :image-url="addModernImageExtension(productGetters.getCoverImage(product))"
              :image-alt="
                'alt-' + productImageGetters.getImageAlternate(productImageGetters.getFirstImage(product)) ||
                productGetters.getName(product) ||
                ''
              "
              :image-title="
                productImageGetters.getImageName(productImageGetters.getFirstImage(product)) ||
                productGetters.getName(product) ||
                ''
              "
              :image-height="productGetters.getImageHeight(product) || 600"
              :image-width="productGetters.getImageWidth(product) || 600"
              :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
              :priority="index < 5"
              :base-price="productGetters.getDefaultBasePrice(product)"
              :unit-content="productGetters.getUnitContent(product)"
              :unit-name="productGetters.getUnitName(product)"
              :show-base-price="productGetters.showPricePerUnit(product)"
            />
          </NuxtLazyHydrate>
        </section>
        <LazyCategoryEmptyState v-else />
        <div v-if="totalProducts > 0" class="mt-4 mb-4 typography-text-xs flex gap-1">
          <span>{{ $t('asterisk') }}</span>
          <span v-if="showNetPrices">{{ $t('itemExclVAT') }}</span>
          <span v-else>{{ $t('itemInclVAT') }}</span>
          <i18n-t keypath="excludedShipping" scope="global">
            <template #shipping>
              <SfLink
                :href="localePath(paths.shipping)"
                target="_blank"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ $t('delivery') }}
              </SfLink>
            </template>
          </i18n-t>
        </div>
        <UiPagination
          v-if="totalProducts > 0"
          :key="`${totalProducts}-${itemsPerPage}`"
          :current-page="getFacetsFromURL().page ?? 1"
          :total-items="totalProducts"
          :page-size="itemsPerPage"
          :max-visible-pages="maxVisiblePages"
        />
      </div>
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { productGetters, productImageGetters } from '@plentymarkets/shop-api';
import { SfIconTune, useDisclosure, SfLink } from '@storefront-ui/vue';
import type { CategoryPageContentProps } from '~/components/CategoryPageContent/types';
import { paths } from '~/utils/paths';

const { title, totalProducts, itemsPerPage = 24, products = [] } = defineProps<CategoryPageContentProps>();

const localePath = useLocalePath();
const { getFacetsFromURL } = useCategoryFilter();
const { addModernImageExtension } = useModernImage();

const { showNetPrices } = useCustomer();

const { isOpen, open, close } = useDisclosure();
const viewport = useViewport();

const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 5 : 2));

if (viewport.isLessThan('md')) close();
</script>
