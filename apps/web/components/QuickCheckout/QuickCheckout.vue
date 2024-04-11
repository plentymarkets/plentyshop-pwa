<template>
  <UiModal
    @mousemove="endTimer()"
    v-if="isOpen"
    v-model="isOpen"
    tag="section"
    class="h-full md:h-fit m-0 p-0 md:w-[1000px]"
    aria-labelledby="quick-checkout-modal"
  >
    <header>
      <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
        <span>{{ t('quickCheckout.heading') }}</span>
      </h2>
      <div class="absolute right-2 top-2 flex items-center">
        <span v-if="timer" class="mr-2 text-gray-400">{{ timer }}s</span>
        <SfButton square variant="tertiary" @click="close">
          <SfIconClose />
        </SfButton>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-4">
      <div class="border-r-2 flex flex-col items-center p-8">
        <NuxtImg
          :src="productGetters.getPreviewImage(product)"
          :alt="t('imageOfSth', { name: productGetters.getName(product) })"
          width="240"
          height="240"
          loading="lazy"
          class="mb-3"
        />

        <h1 class="font-bold typography-headline-4 mb-3" data-testid="product-name">
          {{ productGetters.getName(product) }}
        </h1>

        <div class="mb-3">
          <Price
            :price="currentActualPrice"
            :normal-price="normalPrice"
            :old-price="productGetters.getPrice(product).regular ?? 0"
          />
          <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
            <UiTag :size="'sm'" :variant="'secondary'">{{
              $t('procentageSavings', { percent: productBundleGetters.getBundleDiscount(product) })
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

        <div
          class="mb-4 font-normal typography-text-sm"
          data-testid="product-description"
          v-html="productGetters.getShortDescription(product)"
        ></div>
      </div>
      <div class="py-8 px-10">
        <div class="mb-8">
          <p class="font-medium text-base">{{ t('quickCheckout.cartContains', cartItemsCount) }}</p>
          <div class="grid grid-cols-2">
            <p class="text-base">{{ t('quickCheckout.subTotal') }}:</p>
            <p data-testid="subtotal" class="font-medium text-right">{{ n(totals.subTotal, 'currency') }}</p>
          </div>
        </div>
        <SfButton type="button" class="w-full mb-3" size="lg" variant="secondary" @click="localePath(paths.cart)">
          {{ $t('quickCheckout.checkYourCart') }}
        </SfButton>

        <SfButton
          data-testid="checkout-button"
          :tag="NuxtLink"
          :to="localePath(paths.checkout)"
          size="lg"
          class="w-full mb-4 md:mb-0"
        >
          {{ $t('goToCheckout') }}
        </SfButton>
        <div class="relative flex py-5 px-12 items-center">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="flex-shrink mx-4 text-gray-400">OR</span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>
        <PayPalExpressButton type="CartPreview" />
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfButton, SfIconClose } from '@storefront-ui/vue';
import type { QuickCheckoutProps } from './types';
import { cartGetters, productBundleGetters, productGetters } from '@plentymarkets/shop-sdk';

const props = defineProps<QuickCheckoutProps>();

const NuxtLink = resolveComponent('NuxtLink');
const { t, n } = useI18n();
const { addModernImageExtensionForGallery } = useModernImage();
const { getPropertiesPrice } = useProductOrderProperties();
const localePath = useLocalePath();
const { data: cart } = useCart();
const { isOpen, timer, startTimer, endTimer } = useQuickCheckout();
const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);

onMounted(() => startTimer());
onUnmounted(() => endTimer());

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(cart.value);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vats: totalsData.totalVats,
  };
});

const currentActualPrice = computed(
  () =>
    (productGetters.getGraduatedPriceByQuantity(props.product, 1)?.price.value ??
      productGetters.getPrice(props.product)?.special ??
      productGetters.getPrice(props.product)?.regular ??
      0) + getPropertiesPrice(props.product),
);

const normalPrice =
  productGetters.getGraduatedPriceByQuantity(props.product, 1)?.price.value ??
  productGetters.getPrice(props.product)?.special ??
  productGetters.getPrice(props.product)?.regular ??
  0;

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props.product, 1)?.baseSinglePrice ??
    productGetters.getDefaultBaseSinglePrice(props.product),
);

const close = () => {
  console.log('close');
};
</script>
