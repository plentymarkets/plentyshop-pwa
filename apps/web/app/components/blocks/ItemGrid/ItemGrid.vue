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
        data-testid="item-count"
      >
        <span class="font-bold md:text-lg">
          {{
            t('numberOfProducts', {
              count: products?.length ?? 0,
              total: totalProducts,
            })
          }}
        </span>
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
        data-testid="pagination-top"
      />
    </template>
    <section v-if="products?.length" ref="gridRef" :class="gridClasses" data-testid="category-grid">
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
            data-testid="shipping-link"
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
        :current-page="currentPage"
        :total-items="totalProducts"
        :page-size="itemsPerPage"
        :max-visible-pages="maxVisiblePages"
        data-testid="pagination-bottom"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfLink } from '@storefront-ui/vue';
import type { ItemGridProps } from '~/components/blocks/ItemGrid/types';

const { t } = useI18n();
const { getFacetsFromURL } = useCategoryFilter();

const viewport = useViewport();
const localePath = useLocalePath();
const { showNetPrices } = useCart();
const { data: productsCatalog, productsPerPage } = useProducts();
const { setItemGrid, removeItemGrid } = useItemGridCollection();

const gridRef = ref<HTMLElement | null>(null);

const props = defineProps<ItemGridProps>();
// const { setItemGridHeight } = useItemGridHeight(props.meta.uuid);
const products = computed(() => productsCatalog.value.products || []);
const totalProducts = computed(() => Number(productsCatalog.value.pagination.totals) || 0);
const itemsPerPage = computed(() => Number(productsPerPage.value) || 0);
const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 5 : 2));
const currentPage = computed(() => getFacetsFromURL().page ?? 1);
const categoryId = computed(() => getFacetsFromURL().categoryUrlPath ?? null);

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


onMounted(() => {
  if (gridRef.value) {
    const height = gridRef.value.offsetHeight;
    setItemGrid(props.meta.uuid, height); // Register UUID and height
  }
});

onUnmounted(() => {
  removeItemGrid(props.meta.uuid); // Remove UUID from collection
});
watch([currentPage, categoryId], ([newPage, newCategory], [oldPage, oldCategory]) => {
  if (newPage !== oldPage && newCategory === oldCategory) {
    scrollToHTMLObject('#category-headline', false);
  }
});
</script>
