<template>
  <div class="border-b border-neutral-200">
    <SfAccordionItem v-model="openedVoucher">
      <template #summary>
        <div
          :class="
            !openedVoucher
              ? 'flex justify-between pt-2 pb-3 font-medium'
              : 'flex mt-2 mb-3 justify-between p-3 font-medium bg-gray-100 border-2 border-dashed	border-red-200'
          "
        >
          <p class="pl-3">{{ $t('coupon.title') }}</p>
          <SfIconChevronLeft
            :class="['text-neutral-500', { 'rotate-90': openedVoucher, '-rotate-90': !openedVoucher }]"
          />
        </div>
      </template>
      <div v-if="!cartGetters.getCouponDiscount(cart)" class="flex mb-2">
        <div class="flex-grow mr-2">
          <SfInput :placeholder="$t('coupon.enterCode')" type="text" v-model="couponCode" required />
        </div>
        <SfButton @click="applyVoucher()" class="ml-2" type="reset" variant="primary">
          {{ $t('coupon.apply') }}
        </SfButton>
      </div>
      <div v-else class="flex justify-between mb-3 mt-2">
        <div class="text-primary-800 pl-3 pt-2 font-medium">{{ couponCode }}</div>
        <div>
          <SfButton @click="resetVoucher()" variant="tertiary" class="text-stone-800">
            <span class="underline"> Remove </span>
            <SfIconDelete></SfIconDelete>
          </SfButton>
        </div>
      </div>
    </SfAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-sdk';
import { SfAccordionItem, SfIconChevronLeft, SfInput, SfButton, SfIconDelete } from '@storefront-ui/vue';
import { ref, onMounted } from 'vue';
import { useCart } from '~/composables';
const openedVoucher = ref(false);
const couponCode = ref('NCL5D5');
const { doAddCoupon, deleteCoupon } = useVoucher();
const { data: cart, getCart } = useCart();
const { t } = useI18n();
const { send } = useNotification();
onMounted(() => {
  openedVoucher.value = cartGetters.getCouponDiscount(cart.value) !== 0;
});
const applyVoucher = async () => {
  const cartWithCoupon = await doAddCoupon({ couponCode: couponCode.value });
  if (cartWithCoupon) {
    getCart();
    send({ message: t('coupon.voucherApplied'), type: 'positive' });
  }
};
const resetVoucher = async () => {
  const cartWithoutCoupon = await deleteCoupon({ couponCode: couponCode.value });
  if (cartWithoutCoupon) {
    getCart();
    send({ message: t('coupon.voucherRemoved'), type: 'positive' });
  }
};
</script>
