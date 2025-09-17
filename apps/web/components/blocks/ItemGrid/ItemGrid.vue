<template>
  <div class="flex-1">
    <template v-if="content?.showItemCount">
      <div
        class="flex items-center mb-6"
        :class="{
          'justify-end': content?.itemCountPosition === 'right',
          'justify-center': content?.itemCountPosition === 'center',
          'justify-start': content?.itemCountPosition === 'left',
        }"
      >
        <span class="font-bold md:text-lg">
          {{
            t('numberOfProducts', {
              count: products?.length ?? 0,
              total: totalProducts,
            })
          }}
        </span>
        <UiButton variant="tertiary" class="md:hidden whitespace-nowrap" @click="open">
          <template #prefix>
            <SfIconTune />
          </template>
          {{ t('listSettings') }}
        </UiButton>
      </div>
    </template>

    <template v-if="content?.paginationPosition === 'top' || content?.paginationPosition === 'both'">
      <UiPagination
        v-if="totalProducts > 0"
        :key="`${totalProducts}-${itemsPerPage}`"
        :current-page="getFacetsFromURL().page ?? 1"
        :total-items="totalProducts"
        :page-size="itemsPerPage"
        :max-visible-pages="maxVisiblePages"
      />
    </template>
    <section v-if="products?.length" :class="gridClasses" data-testid="category-grid">
      <NuxtLazyHydrate v-for="(product, index) in products" :key="productGetters.getVariationId(product)" when-visible>
        <UiProductCard :product="product" :configuration="content" :index="index" />
      </NuxtLazyHydrate>
    </section>
    <LazyCategoryEmptyState v-else />
    <div v-if="totalProducts > 0" class="mt-4 mb-4 typography-text-xs flex gap-1">
      <span>{{ t('asterisk') }}</span>
      <span v-if="showNetPrices">{{ t('itemExclVAT') }}</span>
      <span v-else>{{ t('itemInclVAT') }}</span>
      <i18n-t keypath="excludedShipping" scope="global">
        <template #shipping>
          <SfLink
            :href="localePath(paths.shipping)"
            target="_blank"
            class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
          >
            {{ t('delivery') }}
          </SfLink>
        </template>
      </i18n-t>
    </div>
    <template v-if="content?.paginationPosition === 'bottom' || content?.paginationPosition === 'both'">
      <UiPagination
        v-if="totalProducts > 0"
        :key="`${totalProducts}-${itemsPerPage}`"
        :current-page="getFacetsFromURL().page ?? 1"
        :total-items="totalProducts"
        :page-size="itemsPerPage"
        :max-visible-pages="maxVisiblePages"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productImageGetters } from '@plentymarkets/shop-api';
import { paths } from '~/utils/paths';
import { SfIconTune, SfLink, useDisclosure } from '@storefront-ui/vue';
import type { ItemGridProps } from '~/components/blocks/ItemGrid/types';

const { t } = useI18n();
const { getFacetsFromURL, checkFiltersInURL } = useCategoryFilter();
const { addModernImageExtension } = useModernImage();
const { open } = useDisclosure();
const { fetchProducts, data: productsCatalog, productsPerPage } = useProducts();
const viewport = useViewport();
const localePath = useLocalePath();
const { showNetPrices } = useCart();

const props = defineProps<ItemGridProps>();

await fetchProducts({
  categoryUrlPath: '/living-room',
  facets: undefined,
  itemsPerPage: 50,
  page: 1,
  priceMax: undefined,
  priceMin: undefined,
  sort: 'texts.name1_desc',
}).then(() => checkFiltersInURL());

console.log('pops: ', props.content);

const products = computed(() => productsCatalog.value?.products ?? []);
const totalProducts = computed(() => productsCatalog.value?.pagination?.totals ?? []);
const itemsPerPage = computed(() => Number(productsPerPage.value) ?? 0);
const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 5 : 2));

const gridClasses = computed(() =>
  gridClassFor(
    {
      mobile: props.content?.itemsPerRowMobile,
      tablet: props.content?.itemsPerRowTablet,
      desktop: props.content?.itemsPerRowDesktop,
    },
    ['gap-4', 'md:gap-6', 'mb-10', 'md:mb-5'],
  ),
);
</script>
