<template>
  <div class="payment-container" id="pay-container">
    <form id="card-form">
      <div class="row">
        <label class="hosted-fields--label">
          <span class="text-sm font-medium">{{ $t("paypal.unbrandedCardNumber") }}</span>
          <SfInput id="card-number" ref="cardNumber" />
        </label>
      </div>

      <div class="grid grid-cols-2">
        <div>
          <label class="hosted-fields--label">
            <span class="text-sm font-medium">{{ $t("paypal.unbrandedExpirationDate") }}</span>
            <SfInput id="expiration-date" ref="expirationDate" />
          </label>
        </div>
        <div>
          <label class="hosted-fields--label">
            <span class="text-sm font-medium">{{ $t("paypal.unbrandedCvv") }}</span>
            <SfInput id="cvv" ref="cvv" />
          </label>
        </div>
      </div>

      <div class="row">
        <label class="hosted-fields--label">
          <span class="text-sm font-medium">{{ $t("paypal.unbrandedNameOnCard") }}</span>
          <SfInput id="card-holder-name" ref="cardHolderName" />
        </label>
      </div>

      <div class="flex justify-between mt-2">
        <div>
          <SfButton @click="confirmCancel" type="button" variant="secondary">{{ $t("paypal.unbrandedCancel") }}</SfButton>
        </div>
        <div>
          <SfButton @click="confirmPayment" type="button">{{ $t("paypal.unbrandedPay") }}</SfButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfInput } from '@storefront-ui/vue';

const { loadScript, createTransaction } = usePayPal();
const emit = defineEmits(['confirmPayment', 'confirmCancel']);

const vsfCurrency = useCookie('vsf-currency').value as string;
const fallbackCurrency = useAppConfig().fallbackCurrency as string;
const currency = vsfCurrency?.length > 0 ? vsfCurrency : fallbackCurrency;
const paypal = await loadScript(currency);

const cardNumber = ref<HTMLElement | null>(null);
const expirationDate = ref<HTMLElement | null>(null);
const cvv = ref<HTMLElement | null>(null);
const cardHolderName = ref<HTMLElement | null>(null);

onMounted(() => {
  if (paypal && paypal.HostedFields && paypal.HostedFields.isEligible()) {
    console.log(true);
    paypal.HostedFields.render({
      fields: {
        number: {
          selector: '#' + cardNumber.value?.id,
          placeholder: '4111 1111 1111 1111',
        },
        cvv: {
          selector: '#' + cvv.value?.id,
          placeholder: '123',
        },
        expirationDate: {
          selector: '#' + expirationDate.value?.id,
          placeholder: 'MM/YY',
        },
      },
      createOrder: async () => {
        console.log('createOrder');
        const order = await createTransaction('card');
        return order?.id ?? '';
      },
    });
  }
});

const confirmCancel = () => {
  emit('confirmCancel');
}

const confirmPayment = () => {
  emit('confirmPayment');
}
</script>