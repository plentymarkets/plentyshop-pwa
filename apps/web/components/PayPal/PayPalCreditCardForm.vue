<template>
  <header>
    <SfButton type="button" square variant="tertiary" class="absolute right-2 top-2" @click="$emit('confirmCancel')">
      <SfIconClose />
    </SfButton>
    <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-6">
      {{ t('checkoutPayment.creditCard') }}
    </h3>
  </header>
  <div class="payment-container" id="pay-container">
    <div class="row">
      <div class="grid-cols-12">
        <span class="text-sm font-medium">{{ t('paypal.unbrandedCardNumber') }}</span>
        <div id="card-number"></div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-x-5 mt-5">
      <div>
        <div class="grid-cols-12">
          <span class="text-sm font-medium">{{ t('paypal.unbrandedExpirationDate') }}</span>
          <div id="expiration-date"></div>
        </div>
      </div>
      <div>
        <div class="grid-cols-12">
          <span class="text-sm font-medium">{{ t('paypal.unbrandedCvv') }}</span>
          <div id="credit-card-cvv"></div>
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <label class="hosted-fields--label">
        <span class="text-sm font-medium">{{ t('paypal.unbrandedNameOnCard') }}</span>
        <SfInput id="credit-card-name" v-model="cardHolder" class="hosted-field" />
      </label>
    </div>

    <div class="flex justify-between mt-5">
      <div>
        <SfButton @click="confirmCancel" type="button" variant="secondary">{{ t('paypal.unbrandedCancel') }}</SfButton>
      </div>
      <div>
        <SfButton id="creditcard-pay-button" type="submit" :disabled="loading" data-testid="pay-creditcard-button">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>
            {{ t('paypal.unbrandedPay') }}
          </span>
        </SfButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';
import { SfButton, SfIconClose, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { CardFieldsOnApproveData } from '@paypal/paypal-js';

const { shippingPrivacyAgreement } = useAdditionalInformation();
const { data: cart, clearCartItems } = useCart();
const { send } = useNotification();
const { loadScript, createCreditCardTransaction, captureOrder, executeOrder } = usePayPal();
const { createOrder } = useMakeOrder();
const loading = ref(false);
const emit = defineEmits(['confirmPayment', 'confirmCancel']);
const localePath = useLocalePath();
const { t } = useI18n();

const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
// eslint-disable-next-line unicorn/expiring-todo-comments
// TODO: return now PayPalCardFieldsComponent
const paypal = await loadScript(currency.value);
const cardHolder = ref('');

// eslint-disable-next-line sonarjs/cognitive-complexity
onMounted(() => {
  let paypalOrderId = '';
  let paypalPayerId = '';

  if (paypal && paypal.CardFields) {
    const cardFields = paypal.CardFields({
      async createOrder() {
        loading.value = true;
        const data = await createCreditCardTransaction();
        paypalOrderId = data?.id ?? '';
        paypalPayerId = data?.payPalPayerId ?? '';
        return paypalOrderId ?? '';
      },
      async onApprove(data: CardFieldsOnApproveData) {
        const capture = await captureOrder({
          paypalOrderId: data.orderID,
          paypalPayerId: paypalPayerId,
        });
        if (capture?.error) {
          send({
            type: 'negative',
            message: capture.error,
          });
          loading.value = false;
          return;
        }
        const order = await createOrder({
          paymentId: cart.value.methodOfPaymentId,
          shippingPrivacyHintAccepted: shippingPrivacyAgreement.value,
        });
        await executeOrder({
          mode: 'paypal',
          plentyOrderId: Number.parseInt(orderGetters.getId(order)),
          paypalTransactionId: data.orderID,
        });
        clearCartItems();

        if (order?.order?.id) {
          navigateTo(
            localePath(paths.thankYou + '/?orderId=' + order.order.id + '&accessKey=' + order.order.accessKey),
          );
        }
        loading.value = false;
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError() {},
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
        cardFields
          .submit()
          // eslint-disable-next-line promise/always-return
          .then(() => {
            send({
              type: 'positive',
              message: 'Kein Fehler',
            });
          })
          .catch(() => {
            send({
              type: 'negative',
              message: 'Fehler',
            });
          });
      });
    }
  }
});

const confirmCancel = () => {
  emit('confirmCancel');
};
</script>
