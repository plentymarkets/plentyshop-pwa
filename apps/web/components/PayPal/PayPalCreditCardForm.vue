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
    <form ref="form" id="card-form">
      <div class="row">
        <div class="grid-cols-12">
          <span class="text-sm font-medium">{{ t('paypal.unbrandedCardNumber') }}</span>
          <div
            id="card-number"
            class="flex items-center gap-2 px-4 bg-white rounded-md text-neutral-500 hover:ring-primary-700 focus-within:caret-primary-700 active:caret-primary-700 active:ring-primary-700 active:ring-2 focus-within:ring-primary-700 focus-within:ring-2 ring-1 ring-neutral-200 h-[40px]"
          ></div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-5 mt-5">
        <div>
          <div class="grid-cols-12">
            <span class="text-sm font-medium">{{ t('paypal.unbrandedExpirationDate') }}</span>
            <div
              id="expiration-date"
              class="flex items-center gap-2 px-4 bg-white rounded-md text-neutral-500 hover:ring-primary-700 focus-within:caret-primary-700 active:caret-primary-700 active:ring-primary-700 active:ring-2 focus-within:ring-primary-700 focus-within:ring-2 ring-1 ring-neutral-200 h-[40px]"
            ></div>
          </div>
        </div>
        <div>
          <div class="grid-cols-12">
            <span class="text-sm font-medium">{{ t('paypal.unbrandedCvv') }}</span>
            <div
              id="cvv"
              class="flex items-center gap-2 px-4 bg-white rounded-md text-neutral-500 hover:ring-primary-700 focus-within:caret-primary-700 active:caret-primary-700 active:ring-primary-700 active:ring-2 focus-within:ring-primary-700 focus-within:ring-2 ring-1 ring-neutral-200 h-[40px]"
            ></div>
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
          <SfButton @click="confirmCancel" type="button" variant="secondary">{{
            t('paypal.unbrandedCancel')
          }}</SfButton>
        </div>
        <div>
          <SfButton type="submit" :disabled="loading" data-testid="pay-creditcard-button">
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ t('paypal.unbrandedPay') }}
            </span>
          </SfButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { cartGetters, orderGetters } from '@plentymarkets/shop-api';
import { SfButton, SfIconClose, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

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
const paypal = await loadScript(currency.value);
const form = ref<HTMLElement | null>(null);
const cardHolder = ref('');
const sandbox = true;

// eslint-disable-next-line sonarjs/cognitive-complexity
onMounted(() => {
  if (paypal && paypal.HostedFields && paypal.HostedFields.isEligible()) {
    let paypalOrderId: string = '';
    let paypalPayerId: string = '';

    // eslint-disable-next-line promise/catch-or-return
    paypal.HostedFields.render({
      styles: {
        // Styling element state
        '.valid': {
          color: 'green',
        },
        '.invalid': {
          color: 'red',
        },
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111',
        },
        cvv: {
          selector: '#cvv',
          placeholder: '123',
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: 'MM/YY',
        },
      },
      async createOrder() {
        loading.value = true;
        const data = await createCreditCardTransaction();
        paypalOrderId = data?.id ?? '';
        paypalPayerId = data?.payPalPayerId ?? '';
        return paypalOrderId ?? '';
      },
      // eslint-disable-next-line promise/always-return
    }).then(function (hostedFields) {
      // eslint-disable-next-line promise/always-return
      form.value?.addEventListener('submit', (event) => {
        event.preventDefault();
        loading.value = true;
        hostedFields
          .submit({
            cardholderName: cardHolder.value,
            contingencies: ['SCA_WHEN_REQUIRED'],
          })

          // eslint-disable-next-line promise/no-nesting
          .then(async function (payload) {
            // eslint-disable-next-line promise/always-return
            if (payload.liabilityShift === 'NO') {
              send({
                type: 'negative',
                message: t('paypal.errorMessageCreditCard'),
              });
              loading.value = false;
            } else if (payload.liabilityShift === 'POSSIBLE' || sandbox) {
              const capture = await captureOrder({
                paypalOrderId: paypalOrderId,
                paypalPayerId: paypalPayerId,
              });
              const errorDetail = capture?.error;
              if (errorDetail) {
                send({
                  type: 'negative',
                  message: errorDetail,
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
                paypalTransactionId: paypalOrderId,
              });

              clearCartItems();

              if (order?.order?.id) {
                navigateTo(
                  localePath(paths.thankYou + '/?orderId=' + order.order.id + '&accessKey=' + order.order.accessKey),
                );
              }

              loading.value = false;
            }
          })

          // eslint-disable-next-line promise/no-nesting
          .catch(function () {
            send({
              type: 'negative',
              message: t('paypal.errorMessageCreditCard'),
            });
            loading.value = false;
          });
      });
    });
  } else {
    emit('confirmCancel');
  }
});

const confirmCancel = () => {
  emit('confirmCancel');
};
</script>
