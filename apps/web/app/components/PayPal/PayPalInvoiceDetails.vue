<template>
  <div v-if="order.paymentMethodKey === PayPalPayUponInvoiceKey" class="mt-4">
    <h2 class="font-medium text-base">{{ t('account.ordersAndReturns.orderDetails.bankDetails.heading') }}</h2>
    <div v-if="paymentText && typeof paymentText !== 'string'">
      <p>{{ t('paypal.puiBankDataAvailable') }}</p>
      <p class="mt-1">
        {{ t('account.ordersAndReturns.orderDetails.bankDetails.accountOwner') }}: {{ paymentText.account_holder_name
        }}<br />
        {{ t('account.ordersAndReturns.orderDetails.bankDetails.bank') }}: {{ paymentText.bank_name }}<br />
        {{ t('account.ordersAndReturns.orderDetails.bankDetails.iban') }}: {{ paymentText.iban }}<br />
        {{ t('account.ordersAndReturns.orderDetails.bankDetails.bic') }}: {{ paymentText.bic }}<br />
        {{ t('paypal.puiDesignedUse') }}:
        {{ paymentText.designatedUse }}
      </p>
    </div>
    <p v-else>{{ t('paypal.puiBankDataNotAvailable') }}</p>
  </div>
</template>

<script setup lang="ts">
import type { PayPalInvoiceDetailsProps } from '~/components/PayPal/types';

const { t } = useI18n();
const props = defineProps<PayPalInvoiceDetailsProps>();

const paymentText = props.order.paymentText ?? '';
</script>
