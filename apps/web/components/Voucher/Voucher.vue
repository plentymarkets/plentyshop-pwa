<template>
  <div class="mb-5">
    <SfAccordionItem v-model="openedVoucher">
      <template #summary>
        <div class="flex justify-between p-4 font-medium hover:bg-neutral-100 active:neutral-100">
          <p class="p-4 font-medium hover:bg-neutral-100 active:neutral-100">{{ $t('coupon.title') }}</p>
          <SfIconChevronLeft
            :class="['text-neutral-500', { 'rotate-90': openedVoucher, '-rotate-90': !openedVoucher }]"
          />
        </div>
      </template>
      <div class="flex">
        <div class="flex-grow">
          <SfInput :placeholder="$t('coupon.enterCode')" type="text" v-model="couponCode" required />
        </div>
        <SfButton class="ml-2" type="reset" variant="primary"> {{ $t('coupon.apply') }} </SfButton>
      </div>
    </SfAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfAccordionItem, SfIconChevronLeft, SfInput, SfButton } from '@storefront-ui/vue';
import { ref } from 'vue';
const openedVoucher = ref(false);
const couponCode = ref('');
</script>
