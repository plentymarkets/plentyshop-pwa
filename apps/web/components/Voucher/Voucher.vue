<template>
  <div class="border-b border-neutral-200">
    <SfAccordionItem v-model="openedVoucher">
      <template #summary>
        <div
          v-if="!applied"
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
      <div v-if="!applied" class="flex mb-2">
        <div class="flex-grow mr-2">
          <SfInput :placeholder="$t('coupon.enterCode')" type="text" v-model="couponCode" required />
        </div>
        <SfButton @click="applyVoucher()" class="ml-2" type="reset" variant="primary">
          {{ $t('coupon.apply') }}
        </SfButton>
      </div>
      <div v-else class="flex justify-between mb-3 mt-2">
        <div class="text-primary-800 pl-3 pt-2 font-medium">{{ couponCode }} - {{ couponType }}</div>
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
import { SfAccordionItem, SfIconChevronLeft, SfInput, SfButton, SfIconDelete } from '@storefront-ui/vue';
import { ref } from 'vue';
const { t } = useI18n();
const { send } = useNotification();
const openedVoucher = ref(false);
const applied = ref(false);
const couponCode = ref('');
const couponType = ref('10 % discount');
const applyVoucher = () => {
  applied.value = true;
  // neede methods
  // 1. check if voucher is vaid
  // 2. add voucher to order
  // 3. remove voucher from order
  // get voucher and typeof voucher from order
  // send({ message: t('coupon.voucherApplied'), type: 'positive' });
  // send({ message: t('coupon.voucherInvalid'), type: 'negative' });
};
const resetVoucher = () => {
  applied.value = false;
  couponCode.value = '';
  send({ message: t('coupon.voucherRemoved'), type: 'positive' });
};
</script>
