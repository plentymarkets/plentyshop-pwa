<template>
  <div class="mt-4">
    <h2 class="font-medium text-base">{{ t('account.ordersAndReturns.orderDetails.bankDetails.heading') }}</h2>
    <p>
      {{ t('account.ordersAndReturns.orderDetails.bankDetails.accountOwner') }}:
      {{ orderGetters.getOrderPaymentBankDetailsHolder(bankDetails) }}<br />
      {{ t('account.ordersAndReturns.orderDetails.bankDetails.bank') }}:
      {{ orderGetters.getOrderPaymentBankDetailsBankName(bankDetails) }}<br />
      {{ t('account.ordersAndReturns.orderDetails.bankDetails.iban') }}:
      {{ orderGetters.getOrderPaymentBankDetailsIban(bankDetails) }}<br />
      {{ t('account.ordersAndReturns.orderDetails.bankDetails.bic') }}:
      {{ orderGetters.getOrderPaymentBankDetailsSwift(bankDetails) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { OrderBankDetailsProps } from '~/components/OrderBankDetails/types';
import { orderGetters } from '@plentymarkets/shop-api';

const { t } = useI18n();
defineProps<OrderBankDetailsProps>();
</script>
