<template>
  <header>
    <UiButton
      v-if="!disableCloseButton"
      :aria-label="t('closeDialog')"
      type="button"
      square
      variant="tertiary"
      class="absolute right-2 top-2"
      @click="$emit('confirmCancel')"
    >
      <SfIconClose />
    </UiButton>
    <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-6">
      {{ t('checkoutPayment.creditCard') }}
    </h3>
  </header>
  <div id="pay-container" class="payment-container">
    <div class="row">
      <div class="grid-cols-12">
        <UiFormLabel class="pl-2">{{ t('paypal.unbrandedCardNumber') }} *</UiFormLabel>
        <div id="card-number" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-x-5 mt-5">
      <div>
        <div class="grid-cols-12">
          <UiFormLabel class="pl-2">{{ t('paypal.unbrandedExpirationDate') }} *</UiFormLabel>
          <div id="expiration-date" />
        </div>
      </div>
      <div>
        <div class="grid-cols-12">
          <UiFormLabel class="pl-2">{{ t('paypal.unbrandedCvv') }} *</UiFormLabel>
          <div id="credit-card-cvv" />
        </div>
      </div>
    </div>

    <p class="text-sm text-neutral-500 mt-4 mb-2">* {{ t('contact.form.asterixHint') }}</p>

    <div class="flex justify-end gap-x-4 mt-6">
      <div>
        <UiButton type="button" :disabled="disableCloseButton" variant="secondary" @click="confirmCancel">{{ t('paypal.unbrandedCancel') }}</UiButton>
      </div>
      <div>
        <UiButton id="creditcard-pay-button" type="submit" :disabled="loading" data-testid="pay-creditcard-button">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>
            {{ t('paypal.unbrandedPay') }}
          </span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';
import { SfIconClose, SfLoaderCircular } from '@storefront-ui/vue';
import type { CardFieldsOnApproveData } from '@paypal/paypal-js';

const { data: cart, clearCartItems } = useCart();
const { send } = useNotification();
const { getScript, createTransaction, captureOrder, createPlentyPaymentFromPayPalOrder, createPlentyOrder } =
  usePayPal();
const loading = ref(false);
const emit = defineEmits(['confirmPayment', 'confirmCancel']);
const localePath = useLocalePath();
const { t } = useI18n();
const { processingOrder } = useProcessingOrder();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const paypal = await getScript(currency.value);
const { emit: emitPlentyEvent } = usePlentyEvent();
const disableCloseButton = computed(() => processingOrder.value || loading.value);

const confirmCancel = () => {
  emit('confirmCancel');
};

onMounted(() => {
  if (paypal && paypal.CardFields) {
    const cardFields = paypal.CardFields({
      async createOrder() {
        loading.value = true;
        if (!await useCartStockReservation().reserve()) {
          loading.value = false;
          return '';
        }
        const data = await createTransaction({
          type: 'basket',
        });
        return data?.id ?? '';
      },
      async onApprove(data: CardFieldsOnApproveData) {
        const order = await createPlentyOrder();
        if (order?.order?.id) {
          await captureOrder(data.orderID);
          await createPlentyPaymentFromPayPalOrder(data.orderID, order.order.id);

          emitPlentyEvent('module:clearCart', null);
          processingOrder.value = true;
          clearCartItems();

          emitPlentyEvent('frontend:orderCreated', order);
          navigateTo(
            localePath(`${paths.confirmation}/${orderGetters.getId(order)}/${orderGetters.getAccessKey(order)}`),
          );
        }
        loading.value = false;
      },
      async onError() {
        await useCartStockReservation().unreserve();
        send({
          type: 'negative',
          message: t('paypal.errorMessageCreditCard'),
        });
        loading.value = false;
      },
      style: {
        '.invalid': {
          color: 'red',
        },
      },
    });

    if (cardFields.isEligible()) {
      const button = document.querySelector('#creditcard-pay-button');

      const number = cardFields.NumberField({
        placeholder: '4111 1111 1111 1111',
      });
      number.render('#card-number');

      const cvv = cardFields.CVVField({
        placeholder: '123',
      });
      cvv.render('#credit-card-cvv');

      const expiry = cardFields.ExpiryField({
        placeholder: 'MM/YY',
      });
      expiry.render('#expiration-date');

      button?.addEventListener('click', () => {
        cardFields.submit();
      });
    }
  } else {
    confirmCancel();
  }
});
</script>
