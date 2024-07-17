<template>
  <form
    @submit.prevent="handleAddToCart()"
    class="p-4 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-40"
    data-testid="purchase-card"
  >
    <div class="grid grid-cols-[2fr_1fr] mt-4">
      <h1 class="font-bold typography-headline-4" data-testid="product-name">
        {{ productGetters.getName(product) }}
      </h1>
      <div class="flex items-center justify-center">
        <WishlistButton
          :product="product"
          :quantity="quantitySelectorValue"
          :square="viewport.isLessThan('lg')"
          :class="{
            'bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full':
              viewport.isLessThan('lg'),
          }"
        >
          <template v-if="viewport.isGreaterOrEquals('lg')">
            {{ !isWishlistItem(productGetters.getVariationId(product)) ? t('addToWishlist') : t('removeFromWishlist') }}
          </template>
        </WishlistButton>
      </div>
    </div>
    <div class="flex space-x-2">
      <Price
        :price="currentActualPrice"
        :normal-price="normalPrice"
        :old-price="productGetters.getPrice(product).regular ?? 0"
      />
      <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
        <UiTag :size="'sm'" :variant="'secondary'">{{
          t('procentageSavings', { percent: productBundleGetters.getBundleDiscount(product) })
        }}</UiTag>
      </div>
    </div>
    <LowestPrice :product="product" />
    <BasePrice
      v-if="productGetters.showPricePerUnit(product)"
      :base-price="basePriceSingleValue"
      :unit-content="productGetters.getUnitContent(product)"
      :unit-name="productGetters.getUnitName(product)"
    />
    <UiBadges class="mt-4" :product="product" :use-availability="true" />
    <VariationProperties :product="product" />
    <div class="inline-flex items-center mt-4 mb-2">
      <SfRating
        size="xs"
        :half-increment="true"
        :value="reviewGetters.getAverageRating(reviewAverage, 'half')"
        :max="5"
      />
      <SfCounter class="ml-1" size="xs">{{ reviewGetters.getTotalReviews(reviewAverage) }}</SfCounter>
      <SfButton variant="tertiary" @click="scrollToReviews" class="ml-2 text-xs text-neutral-500 cursor-pointer">
        {{ t('showAllReviews') }}
      </SfButton>
    </div>
    <div
      v-if="productGetters.getShortDescription(product).length > 0"
      class="mb-4 font-normal typography-text-sm whitespace-pre-line break-words"
      data-testid="product-description"
    >
      {{ productGetters.getShortDescription(product) }}
    </div>

    <BundleOrderItems v-if="product.bundleComponents" :product="product" />
    <OrderProperties :product="product" />
    <ProductAttributes :product="product" />
    <GraduatedPriceList :product="product" :count="quantitySelectorValue" />

    <div class="py-4">
      <div class="flex flex-col md:flex-row flex-wrap gap-4">
        <UiQuantitySelector
          :value="quantitySelectorValue"
          @change-quantity="changeQuantity"
          class="min-w-[145px] flex-grow-0 flex-shrink-0 basis-0"
        />
        <SfTooltip
          show-arrow
          placement="top"
          :label="isNotValidVariation || isSalableText"
          class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
        >
          <SfButton
            type="submit"
            data-testid="add-to-cart"
            size="lg"
            class="w-full h-full"
            :disabled="loading || !productGetters.isSalable(product)"
          >
            <template #prefix>
              <div v-if="!loading" class="flex row items-center">
                <SfIconShoppingCart size="sm" />
                {{ t('addToCart') }}
              </div>
              <div v-else>
                <SfLoaderCircular size="sm" />
              </div>
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

      <PayPalExpressButton v-if="getCombination()" class="mt-4" type="SingleItem" @on-click="paypalHandleAddToCart" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { productGetters, reviewGetters, productBundleGetters } from '@plentymarkets/shop-api';
import { SfButton, SfCounter, SfRating, SfIconShoppingCart, SfLoaderCircular, SfTooltip } from '@storefront-ui/vue';
import type { PurchaseCardProps } from '~/components/ui/PurchaseCard/types';
import type { PayPalAddToCartCallback } from '~/components/PayPal/types';

const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;

const { product, reviewAverage } = defineProps<PurchaseCardProps>();

const viewport = useViewport();
const { getCombination } = useProductAttributes();
const { getPropertiesForCart, getPropertiesPrice } = useProductOrderProperties();
const { validateAllFields, invalidFields, resetInvalidFields } = useValidatorAggregator('properties');
const {
  validateAllFields: validateAllFieldsAttributes,
  invalidFields: invalidAttributeFields,
  resetInvalidFields: resetAttributeFields,
} = useValidatorAggregator('attributes');
const { send } = useNotification();
const { addToCart, loading } = useCart();
const { t } = useI18n();
const quantitySelectorValue = ref(1);
const { isWishlistItem } = useWishlist();
const { openQuickCheckout } = useQuickCheckout();

resetInvalidFields();
resetAttributeFields();

const currentActualPrice = computed(
  () =>
    (productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.price.value ??
      productGetters.getPrice(product)?.special ??
      productGetters.getPrice(product)?.regular ??
      0) + getPropertiesPrice(product),
);

const normalPrice =
  productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.price.value ??
  productGetters.getPrice(product)?.special ??
  productGetters.getPrice(product)?.regular ??
  0;

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.baseSinglePrice ??
    productGetters.getDefaultBaseSinglePrice(product),
);

const handleAddToCart = async (quickCheckout = true) => {
  await validateAllFieldsAttributes();
  await validateAllFields();
  if (invalidFields.value.length > 0 || invalidAttributeFields.value.length > 0) {
    const invalidFieldsNames = invalidFields.value.map((field) => field.name);
    const invalidAttributeFieldsNames = invalidAttributeFields.value.map((field) => field.name);
    send({
      message: [
        t('errorMessages.missingOrWrongProperties'),
        '',
        ...invalidAttributeFieldsNames,
        ...invalidFieldsNames,
        '',
        t('errorMessages.pleaseFillOutAllFields'),
      ],
      type: 'negative',
    });
    return false;
  }

  if (!getCombination()) {
    send({ message: t('productAttributes.notValidVariation'), type: 'negative' });
    return false;
  }

  const params = {
    productId: Number(productGetters.getId(product)),
    quantity: Number(quantitySelectorValue.value),
    basketItemOrderParams: getPropertiesForCart(),
  };

  const added = await addToCart(params);
  if (added) {
    if (quickCheckout) openQuickCheckout(product, quantitySelectorValue.value);
    send({ message: t('addedToCart'), type: 'positive' });
  }
  return added;
};

const paypalHandleAddToCart = async (callback: PayPalAddToCartCallback) => {
  const added = await handleAddToCart(false);

  callback(added);
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
  const customerReviewsAccordionElementOffset =
    customerReviewsAccordionElement?.getBoundingClientRect()?.top + document.documentElement.scrollTop || 0;

  const headerElement = document.querySelector('header') as HTMLElement;
  const headerElementOffset = headerElement.offsetHeight ?? 0;

  window.scrollTo({
    top: customerReviewsAccordionElementOffset - headerElementOffset,
    behavior: 'smooth',
  });
};

const isSalableText = computed(() => (productGetters.isSalable(product) ? '' : t('itemNotAvailable')));
const isNotValidVariation = computed(() => (getCombination() ? '' : t('productAttributes.notValidVariation')));

const scrollToReviews = () => {
  if (!isReviewsAccordionOpen()) {
    openReviewsAccordion();
  }

  scrollToReviewsAccordion();
};
</script>
