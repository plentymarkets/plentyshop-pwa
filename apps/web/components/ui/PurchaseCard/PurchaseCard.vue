<template>
  <section
    class="p-4 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-40"
    data-testid="purchase-card"
  >
    <h1 class="mb-1 font-bold typography-headline-4" data-testid="product-name">
      {{ productGetters.getName(product) }}
    </h1>
    <div class="my-1">
      <span class="mr-2 text-secondary-700 font-bold font-headings text-2xl" data-testid="price">
        {{ $n(actualPrice, 'currency') }}
      </span>
      <span
        v-if="productGetters.getPrice(product)?.special"
        class="text-base font-normal text-neutral-500 line-through"
      >
        {{ $n(productGetters.getRegularPrice(product), 'currency') }}
      </span>
    </div>
    <div class="inline-flex items-center mt-4 mb-2">
      <SfRating size="xs" :value="productGetters.getAverageRating(reviewAverage)" :max="5" />
      <SfCounter class="ml-1" size="xs">{{ productGetters.getTotalReviews(reviewAverage) }}</SfCounter>
      <SfLink variant="secondary" @click="scrollToReviews" class="ml-2 text-xs text-neutral-500 cursor-pointer">
        {{ $t('showAllReviews') }}
      </SfLink>
    </div>
    <div
      class="mb-4 font-normal typography-text-sm"
      data-testid="product-description"
      v-html="productGetters.getShortDescription(product)"
    ></div>
    <div class="mb-2">
      <AttributeSelect v-if="product" :product="product" />
    </div>
    <div class="py-4">
      <div class="flex flex-col md:flex-row flex-wrap gap-4">
        <UiQuantitySelector
          :value="quantitySelectorValue"
          @change-quantity="changeQuantity"
          class="min-w-[145px] flex-grow flex-shrink-0 basis-0"
        />
        <SfButton
          type="button"
          size="lg"
          class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
          @click="
            addToCart({
              productId: Number(productGetters.getId(product)),
              quantity: Number(quantitySelectorValue),
            })
          "
          :disabled="loading"
        >
          <template #prefix v-if="!loading">
            <SfIconShoppingCart size="sm" />
          </template>
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>
            {{ $t('addToCart') }}
          </span>
        </SfButton>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import {SfButton, SfCounter, SfLink, SfRating, SfIconShoppingCart, SfLoaderCircular} from '@storefront-ui/vue';
import type { PurchaseCardProps } from '~/components/ui/PurchaseCard/types';

const props = defineProps<PurchaseCardProps>();

const { product } = toRefs(props);

const { addToCart, loading } = useCart();

const actualPrice = computed(
  () => productGetters.getPrice(product.value)?.special ?? productGetters.getPrice(product.value)?.regular ?? 0,
);

const quantitySelectorValue = ref(1);

const changeQuantity = (quantity: string) => {
  quantitySelectorValue.value = Number(quantity);
};

const isReviewsAccordionOpen = () => {
  const customerReviewsAccordionDetailsElement = document.querySelector('#customerReviewsAccordion')
    ?.firstChild as HTMLDetailsElement;

  return customerReviewsAccordionDetailsElement.open;
};

const openReviewsAccordion = () => {
  const customerReviewsClickElement = document.querySelector('#customerReviewsClick') as HTMLElement;
  customerReviewsClickElement?.click();
};

const scrollToReviewsAccordion = () => {
  const customerReviewsAccordionElement = document.querySelector('#customerReviewsAccordion') as HTMLElement;
  const customerReviewsAccordionElementOffset = customerReviewsAccordionElement?.offsetTop ?? 0;

  const headerElement = document.querySelector('header') as HTMLElement;
  const headerElementOffset = headerElement.offsetHeight ?? 0;

  window.scrollTo({
    top: customerReviewsAccordionElementOffset - headerElementOffset,
    behavior: 'smooth',
  });
};

const scrollToReviews = () => {
  if (!isReviewsAccordionOpen()) {
    openReviewsAccordion();
  }

  scrollToReviewsAccordion();
};
</script>
