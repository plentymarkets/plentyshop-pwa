<template>
  <div class="payment-container" id="pay-container">
    <form id="card-form">
      <div class="row">
        <label class="hosted-fields--label">
          <span class="text-sm font-medium">{{ $t('paypal.unbrandedCardNumber') }}</span>
          <SfInput v-model="cardNumber" />
        </label>
      </div>

      <div class="grid grid-cols-2">
        <div>
          <label class="hosted-fields--label">
            <span class="text-sm font-medium">{{ $t('paypal.unbrandedExpirationDate') }}</span>
            <SfInput v-model="expirationDate" />
          </label>
        </div>
        <div>
          <label class="hosted-fields--label">
            <span class="text-sm font-medium">{{ $t('paypal.unbrandedCvv') }}</span>
            <SfInput v-model="ccv" />
          </label>
        </div>
      </div>

      <div class="row">
        <label class="hosted-fields--label">
          <span class="text-sm font-medium">{{ $t('paypal.unbrandedNameOnCard') }}</span>
          <SfInput v-model="cardHolderName" />
        </label>
      </div>

      <div class="flex justify-between mt-2">
        <div>
          <SfButton @click="confirmCancel" type="button" variant="secondary">{{
            $t('paypal.unbrandedCancel')
          }}</SfButton>
        </div>
        <div>
          <SfButton @click="confirmPayment" type="button">{{ $t('paypal.unbrandedPay') }}</SfButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfInput } from '@storefront-ui/vue';

const emit = defineEmits(['confirmPayment', 'confirmCancel']);

const cardNumber = ref('');
const expirationDate = ref('');
const ccv = ref('');
const cardHolderName = ref('');

const confirmCancel = () => {
  emit('confirmCancel');
};

const confirmPayment = () => {
  emit('confirmPayment');
};
</script>
