<template>
    <SfScrollable
      ref="sliderRootRef"
      buttons-placement="floating"
    class="pb-4 scrollbar-hidden"
    :wrapper-class="wrapperClass"
    data-testid="product-slider"
  >
    <UiProductCard
      v-for="(product, index) in items"
      :key="productGetters.getId(product)"
      :product="product"
      :should-load-image="shouldLoadImage(index)"
      :index="index"
      is-from-slider
      class="w-48 max-w-48 shrink-0"
    />
  </SfScrollable>

  <div class="mt-4 typography-text-xs flex gap-1">
    <span>{{ t('common.labels.asterisk') }}</span>
    <span v-if="showNetPrices">{{ t('product.priceExclVAT') }}</span>
    <span v-else>{{ t('product.priceInclVAT') }}</span>
    <i18n-t keypath="shipping.excludedLabel" scope="global">
      <template #shipping>
        <SfLink
          :href="localePath(paths.shipping)"
          target="_blank"
          class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
        >
          {{ t('common.labels.delivery') }}
        </SfLink>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable, SfLink } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';
import { paths } from '~/utils/paths';

const { showNetPrices } = useCart();
const localePath = useLocalePath();

defineProps<ProductSliderProps>();

const sliderRootRef = ref<HTMLElement | null>(null);
const scrollContainerRef = ref<HTMLElement | null>(null);
const currentPage = ref(0);
const itemsPerPage = ref(1);
const activatedIndexes = ref<Set<number>>(new Set());

const ITEM_WIDTH = 192;
const ITEM_GAP = 16;

const updateMetrics = () => {
  const el = scrollContainerRef.value;
  if (!el) return;

  const containerWidth = el.clientWidth || 1;
  const itemFullWidth = ITEM_WIDTH + ITEM_GAP;

  itemsPerPage.value = Math.max(1, Math.floor(containerWidth / itemFullWidth));
  currentPage.value = Math.floor(el.scrollLeft / containerWidth);
};

const activatePage = (page: number) => {
  if (page < 0) return;

  const start = page * itemsPerPage.value;
  const end = start + itemsPerPage.value - 1;

  for (let i = start; i <= end; i++) {
    activatedIndexes.value.add(i);
  }
};

const updateActivatedWindow = () => {
  updateMetrics();
  activatePage(currentPage.value);
  activatePage(currentPage.value + 1);
};

const shouldLoadImage = (index: number) => {
  return activatedIndexes.value.has(index);
};

const resolveScrollContainer = () => {
  if (!sliderRootRef.value) return null;

  return (
    sliderRootRef.value.querySelector('[data-testid="product-slider"] [class*="overflow-x-auto"]') ||
    sliderRootRef.value.querySelector('[data-testid="product-slider"] .sf-scrollable__wrapper') ||
    sliderRootRef.value.querySelector('[data-testid="product-slider"]')
  ) as HTMLElement | null;
};

onMounted(async () => {
  await nextTick();

  scrollContainerRef.value = resolveScrollContainer();

  if (!scrollContainerRef.value) return;

  updateActivatedWindow();

  scrollContainerRef.value.addEventListener('scroll', updateActivatedWindow, { passive: true });
  window.addEventListener('resize', updateActivatedWindow, { passive: true });
});

onBeforeUnmount(() => {
  scrollContainerRef.value?.removeEventListener('scroll', updateActivatedWindow);
  window.removeEventListener('resize', updateActivatedWindow);
});
</script>
