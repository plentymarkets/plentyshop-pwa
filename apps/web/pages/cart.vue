<template>
  <NuxtLayout
    name="checkout"
    :back-to-cart="false"
    :back-label-desktop="$t('back')"
    :back-label-mobile="$t('back')"
    :heading="$t('myCart')"
  >
    <div v-if="cartNotEmpty" class="md:grid md:grid-cols-12 md:gap-x-6" data-testid="cart-page-content">
      <div class="col-span-7 mb-2 md:mb-0">
        <div v-for="(cartItem, index) in cart?.items" :key="cartItem.id">
          <UiCartProductCard :cart-item="cartItem" :class="{ 'border-t': index === 0 }" />
        </div>
        <Coupon class="mb-2" v-if="viewport.isLessThan('lg')" />
      </div>
      <div class="relative col-span-5 md:sticky md:top-10 h-fit" :class="{ 'pointer-events-none opacity-50': loading }">
        <SfLoaderCircular v-if="loading" class="absolute top-[130px] right-0 left-0 m-auto z-[999]" size="2xl" />
        <OrderSummary :cart="cart">
          <Coupon v-if="viewport.isGreaterOrEquals('lg')" class="mb-5" />
          <SfButton
            data-testid="checkout-button"
            :tag="NuxtLink"
            :to="goToCheckout()"
            size="lg"
            class="w-full mb-4 md:mb-0"
          >
            {{ $t('goToCheckout') }}
          </SfButton>
          <PayPalExpressButton :disabled="loading" class="mt-4" type="CartPreview" />
        </OrderSummary>
      </div>
    </div>
    <div v-else class="flex items-center justify-center flex-col pt-24 pb-32" data-testid="cart-page-content">
      <h2 class="mt-8 typography-headline-3 font-bold">{{ $t('emptyCart') }}</h2>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({ pageType: 'static' });

const NuxtLink = resolveComponent('NuxtLink');
const viewport = useViewport();
const localePath = useLocalePath();
const { isAuthorized } = useCustomer();
const { data: cart, loading } = useCart();
const cartNotEmpty = computed(() => (cart.value?.items?.length ?? 0) > 0);
const goToCheckout = () => (isAuthorized.value ? localePath(paths.checkout) : localePath(paths.guestLogin));
</script>
