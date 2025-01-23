<template>
  <UiModal
    v-if="isOpen"
    v-model="isOpen"
    tag="section"
    class="h-full md:h-fit m-0 p-0 lg:w-[1000px] overflow-y-auto"
    aria-label="quick-checkout-modal"
    @mousemove="endTimer()"
  >
    <header>
      <h2 class="font-bold text-lg leading-6 md:text-2xl">
        <span>{{ t('quickCheckout.heading') }}</span>
      </h2>
      <div class="absolute right-2 top-2 flex items-center">
        <span v-if="hasTimer" class="mr-2 text-gray-400">{{ timer }}s</span>
        <UiButton
          :aria-label="$t('closeDialog')"
          data-testid="quick-checkout-close"
          square
          variant="tertiary"
          @click="close"
        >
          <SfIconClose />
        </UiButton>
      </div>
    </header>

    <div class="lg:grid lg:grid-cols-2 lg:gap-4">
      <div class="lg:border-r-2 flex flex-col items-center p-8">
        <NuxtImg
          :src="addModernImageExtension(productGetters.getMiddleImage(product))"
          :alt="t('imageOfSth', { name: productGetters.getName(product) })"
          width="240"
          height="240"
          loading="lazy"
          class="mb-3"
        />
        <div class="flex mb-1">
          <h1 class="font-bold typography-headline-4" data-testid="product-name">
            {{ productGetters.getName(product) }}
          </h1>
        </div>
        <div class="mb-3">
          <span class="self-center text-gray-600 sm:typography-headline-4 typography-headline-3">
            {{ t('account.ordersAndReturns.orderDetails.quantity') }}: {{ quantity }}
          </span>
        </div>

        <ProductPrice :product="product" />

        <div class="mb-4 font-normal typography-text-sm" data-testid="product-description">
          {{ productGetters.getShortDescription(product) }}
        </div>

        <div class="mt-4 typography-text-xs flex gap-1">
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
                {{ $t('delivery') }}
              </SfLink>
            </template>
          </i18n-t>
        </div>

        <VariationProperties :product="lastUpdatedProduct" />
      </div>
      <div class="py-8 px-10">
        <div class="mb-8">
          <p class="font-medium text-base">{{ t('quickCheckout.cartContains', cartItemsCount) }}</p>
          <div class="grid grid-cols-2">
            <p class="text-base">{{ t('quickCheckout.subTotal') }}:</p>
            <p data-testid="subtotal" class="font-medium text-right">{{ n(totals.subTotal, 'currency') }}</p>
          </div>
        </div>

        <UiButton
          data-testid="quick-checkout-cart-button"
          size="lg"
          class="w-full mb-3"
          variant="secondary"
          @click="goToPage(paths.cart)"
        >
          {{ t('quickCheckout.checkYourCart') }}
        </UiButton>

        <UiButton
          data-testid="quick-checkout-checkout-button"
          size="lg"
          class="w-full mb-4 md:mb-0"
          @click="goToPage(paths.checkout)"
        >
          {{ t('goToCheckout') }}
        </UiButton>
        <OrDivider v-if="isPaypalAvailable" class="my-4" />
        <PayPalExpressButton class="w-full text-center" type="CartPreview" @on-approved="isOpen = false" />
        <PayPalPayLaterBanner placement="payment" :amount="totals.total" />
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, SfLink } from '@storefront-ui/vue';
import type { QuickCheckoutProps } from './types';
import type { Product } from '@plentymarkets/shop-api';
import { cartGetters, productGetters } from '@plentymarkets/shop-api';
import ProductPrice from '~/components/ProductPrice/ProductPrice.vue';
import { paths } from '~/utils/paths';

defineProps<QuickCheckoutProps>();

const { t, n } = useI18n();

const { showNetPrices } = useCustomer();

const localePath = useLocalePath();
const { data: cart, lastUpdatedCartItem } = useCart();
const { isAvailable: isPaypalAvailable, loadConfig } = usePayPal();
const { addModernImageExtension } = useModernImage();
const { isOpen, timer, startTimer, endTimer, closeQuickCheckout, hasTimer, quantity } = useQuickCheckout();
const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);

onMounted(() => {
  startTimer();
  loadConfig();
});
onUnmounted(() => endTimer());

const lastUpdatedProduct = computed(() => cartGetters.getVariation(lastUpdatedCartItem.value) || ({} as Product));

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(cart.value);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vats: totalsData.totalVats,
  };
});

const goToPage = (path: string) => {
  closeQuickCheckout();
  navigateTo(localePath(path));
};

const close = () => {
  closeQuickCheckout();
};
</script>
