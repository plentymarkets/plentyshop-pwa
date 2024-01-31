<template>
  <form
    @submit.prevent="handleAddToCart"
    class="p-4 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-40"
    data-testid="purchase-card"
  >
    <div class="grid grid-cols-[2fr_1fr] mt-4">
      <h1 class="mb-1 font-bold typography-headline-4" data-testid="product-name">
        {{ productGetters.getName(product) }}
      </h1>
      <div class="flex items-center justify-center">
        <WishlistButton v-if="isDesktop" :product="product" :quantity="quantitySelectorValue">
          <template v-if="!isWishlistItem(productGetters.getVariationId(product))">
            {{ t('addToWishlist') }}
          </template>
          <template v-else>
            {{ t('removeFromWishlist') }}
          </template>
        </WishlistButton>

        <WishlistButton
          v-else
          square
          class="bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full"
          :product="product"
          :quantity="quantitySelectorValue"
        />
      </div>
    </div>
    <Price
      :price="currentActualPrice"
      :normal-price="normalPrice"
      :old-price="productGetters.getPrice(product).regular ?? 0"
    />
    <LowestPrice :product="product" />
    <div v-if="productGetters.showPricePerUnit(product)">
      <BasePrice
        :base-price="basePriceSingleValue"
        :unit-content="productGetters.getUnitContent(product)"
        :unit-name="productGetters.getUnitName(product)"
      />
    </div>
    <div class="inline-flex items-center mt-4 mb-2">
      <SfRating size="xs" :value="reviewGetters.getAverageRating(reviewAverage)" :max="5" />
      <SfCounter class="ml-1" size="xs">{{ reviewGetters.getTotalReviews(reviewAverage) }}</SfCounter>
      <SfLink variant="secondary" @click="scrollToReviews" class="ml-2 text-xs text-neutral-500 cursor-pointer">
        {{ t('showAllReviews') }}
      </SfLink>
    </div>
    <div
      class="mb-4 font-normal typography-text-sm"
      data-testid="product-description"
      v-html="productGetters.getShortDescription(product)"
    ></div>

    <OrderProperties v-if="product" :product="product" />

    <div class="mb-2">
      <AttributeSelect v-if="product" :product="product" />
    </div>
    <GraduatedPriceList v-if="product" :product="product" :count="quantitySelectorValue" />
    <div class="py-4">
      <div class="flex flex-col md:flex-row flex-wrap gap-4">
        <UiQuantitySelector
          :value="quantitySelectorValue"
          @change-quantity="changeQuantity"
          class="min-w-[145px] flex-grow flex-shrink-0 basis-0"
        />
        <SfTooltip
          show-arrow
          placement="top"
          :label="isSalableText"
          class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
        >
          <SfButton
            type="submit"
            data-testid="add-to-cart"
            size="lg"
            class="w-full"
            :disabled="loading || !productGetters.isSalable(product)"
          >
            <template #prefix v-if="!loading">
              <SfIconShoppingCart size="sm" />
            </template>
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
            <template v-else>
              {{ t('addToCart') }}
            </template>
          </SfButton>
        </SfTooltip>
      </div>

      <div class="mt-4 typography-text-xs flex gap-1">
        <span>{{ t('asterisk') }}</span>
        <span v-if="showNetPrices">{{ t('itemExclVAT') }}</span>
        <span v-else>{{ t('itemInclVAT') }}</span>
        <span>{{ t('excludedShipping') }}</span>
      </div>

      <div
        class="typography-text-xs flex gap-1"
        v-if="
          productPropertyGetters.groupsHasRequiredOrderProperties(
            productPropertyGetters.getOrderPropertiesGroups(product),
          )
        "
      >
        <span>{{ t('asterisk') }}{{ t('asterisk') }}</span>
        <span>{{ t('orderProperties.hasRequiredFields') }}</span>
      </div>
      <PayPalExpressButton
        class="mt-4"
        type="SingleItem"
        :value="{ product: product, quantity: quantitySelectorValue, basketItemOrderParams: getPropertiesForCart() }"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { productGetters, reviewGetters, productPropertyGetters } from '@plentymarkets/shop-sdk';
import {
  SfButton,
  SfCounter,
  SfLink,
  SfRating,
  SfIconShoppingCart,
  SfLoaderCircular,
  SfTooltip,
} from '@storefront-ui/vue';
import type { PurchaseCardProps } from '~/components/ui/PurchaseCard/types';

const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;

const props = defineProps<PurchaseCardProps>();

const { product } = toRefs(props);

const { isDesktop } = useBreakpoints();
const { getPropertiesForCart, getPropertiesPrice } = useProductOrderProperties();
const { validateAllFields, invalidFields, resetInvalidFields } = useValidatorAggregatorProperties();
const { send } = useNotification();
const { addToCart, loading } = useCart();
const { t } = useI18n();
const quantitySelectorValue = ref(1);
const { isWishlistItem } = useWishlist();

resetInvalidFields();

const currentActualPrice = computed(
  () =>
    (productGetters.getGraduatedPriceByQuantity(product.value, quantitySelectorValue.value)?.price.value ??
      productGetters.getPrice(product.value)?.special ??
      productGetters.getPrice(product.value)?.regular ??
      0) + getPropertiesPrice(product.value),
);

const normalPrice =
  productGetters.getGraduatedPriceByQuantity(product.value, quantitySelectorValue.value)?.price.value ??
  productGetters.getPrice(product.value)?.special ??
  productGetters.getPrice(product.value)?.regular ??
  0;

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(product.value, quantitySelectorValue.value)?.baseSinglePrice ??
    productGetters.getDefaultBaseSinglePrice(product.value),
);

const handleAddToCart = async () => {
  await validateAllFields();
  if (invalidFields.value.length > 0) {
    const invalidFieldsNames = invalidFields.value.map((field) => field.name);
    send({
      message: [
        t('errorMessages.missingOrWrongProperties'),
        '',
        ...invalidFieldsNames,
        '',
        t('errorMessages.pleaseFillOutAllFields'),
      ],
      type: 'negative',
    });
    return;
  }

  const params = {
    productId: Number(productGetters.getId(product.value)),
    quantity: Number(quantitySelectorValue.value),
    basketItemOrderParams: getPropertiesForCart(),
  };

  if (await addToCart(params)) {
    send({ message: t('addedToCart'), type: 'positive' });
  }
};

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

const isSalableText = computed(() => (productGetters.isSalable(product.value) ? '' : t('itemNotAvailable')));

const scrollToReviews = () => {
  if (!isReviewsAccordionOpen()) {
    openReviewsAccordion();
  }

  scrollToReviewsAccordion();
};
</script>
