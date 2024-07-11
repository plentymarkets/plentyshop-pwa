<template>
  <div class="border-b border-neutral-200">
    <SfAccordionItem v-if="!cartGetters.getCouponDiscount(cart)" data-testid="couponZone" v-model="openedCoupon">
      <template #summary>
        <div :class="['flex justify-between font-medium p-3', { 'my-4 bg-gray-100 rounded-md': openedCoupon }]">
          <p class="pl-3">{{ $t('coupon.title') }}</p>
          <SfIconChevronLeft
            :class="['text-neutral-500', { 'rotate-90': openedCoupon, '-rotate-90': !openedCoupon }]"
          />
        </div>
      </template>
      <div class="flex mb-4">
        <div class="flex-grow mr-2" data-testid="couponCode">
          <SfInput :placeholder="$t('coupon.enterCode')" type="text" v-model="couponCode" name="couponCode" required />
        </div>
        <SfButton
          data-testid="couponAdd"
          @click="addCoupon({ couponCode })"
          class="ml-2"
          type="reset"
          variant="primary"
          :disabled="loading"
        >
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>
            {{ $t('coupon.apply') }}
          </span>
        </SfButton>
      </div>
    </SfAccordionItem>
    <div v-else class="flex justify-between my-4">
      <div class="text-primary-800 font-medium flex items-center">{{ couponCode }}</div>
      <div>
        <SfButton
          data-testid="couponRemove"
          @click="handleDeleteCoupon"
          variant="tertiary"
          class="text-stone-800"
          :disabled="loading"
        >
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else class="underline">
            {{ $t('coupon.remove') }}
            <SfIconClose />
          </span>
        </SfButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-api';
import {
  SfAccordionItem,
  SfIconChevronLeft,
  SfIconClose,
  SfInput,
  SfButton,
  SfLoaderCircular,
} from '@storefront-ui/vue';
const openedCoupon = ref(false);
const couponCode = ref('');
const { addCoupon, deleteCoupon, loading } = useCoupon();
const { data: cart } = useCart();

const handleDeleteCoupon = async () => {
  await deleteCoupon({ couponCode: couponCode.value });
  couponCode.value = '';
};

onMounted(() => {
  couponCode.value = cartGetters.getCouponCode(cart.value);
  openedCoupon.value = cartGetters.getCouponDiscount(cart.value) !== 0;
});
</script>
