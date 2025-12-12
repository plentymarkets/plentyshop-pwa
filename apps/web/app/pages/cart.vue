<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="t('common.actions.back')"
    :back-label-mobile="t('common.actions.back')"
    :heading="t('cart.myCart')"
  >
    <div v-if="!cartIsEmpty" class="md:grid md:grid-cols-12 md:gap-x-6" data-testid="cart-page-content">
      <div class="col-span-7 mb-2 md:mb-0">
        <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
          <UiCartProductCard :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
        </div>
        <Coupon v-if="viewport.isLessThan('lg')" class="mb-2" />
      </div>
      <div class="relative col-span-5 md:sticky md:top-10 h-fit" :class="{ 'pointer-events-none opacity-50': loading }">
        <SfLoaderCircular v-if="loading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
        <OrderSummary :cart="cart">
          <Coupon v-if="viewport.isGreaterOrEquals('lg')" class="mb-5" />
          <UiButton
            data-testid="checkout-button"
            :tag="NuxtLink"
            :to="goToCheckout()"
            size="lg"
            class="w-full mb-4 md:mb-0"
          >
            {{ t('common.actions.goToCheckout') }}
          </UiButton>
          <client-only>
            <PayPalExpressButton :disabled="loading" location="cartPage" class="mt-4" type="CartPreview" />
            <PayPalPayLaterBanner
              placement="cart"
              location="cartPage"
              :amount="cartGetters.getTotal(cartGetters.getTotals(cart))"
            />
          </client-only>
        </OrderSummary>
      </div>
    </div>
    <div v-else class="flex items-center justify-center flex-col pt-24 pb-32" data-testid="cart-page-content">
      <h2 class="mt-8 typography-headline-3 font-bold">{{ t('cart.empty') }}</h2>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import { cartGetters } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});
const { setPageMeta } = usePageMeta();

definePageMeta({ pageType: 'static' });

const NuxtLink = resolveComponent('NuxtLink');
const viewport = useViewport();
const localePath = useLocalePath();
const { isAuthorized } = useCustomer();
const { data: cart, cartIsEmpty, loading } = useCart();
const goToCheckout = () => (isAuthorized.value ? localePath(paths.checkout) : localePath(paths.guestLogin));

const icon = 'page';
setPageMeta(t('common.labels.cart'), icon);
</script>
