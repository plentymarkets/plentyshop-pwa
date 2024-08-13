<template>
  <div id="applepay-container"></div>
</template>

<script lang="ts" setup>
import { ApplepayType } from '~/components/PayPal/types';

async function setupApplepay() {
  const paypal = window.paypal;
  const applepay = paypal?.Applepay() as ApplepayType;
  const { isEligible, countryCode, currencyCode, merchantCapabilities, supportedNetworks } = await applepay.config();

  if (!isEligible) {
    throw new Error('applepay is not eligible');
  }
  const applePayContainer = document.querySelector('#applepay-container');
  if (applePayContainer) {
    applePayContainer.innerHTML = '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en">';
    const btnApplePay = document.querySelector('#btn-appl');
    if (btnApplePay) {
      btnApplePay.addEventListener('click', onClick);
    }
  }
  async function onClick() {
    console.log({ merchantCapabilities, currencyCode, supportedNetworks });

    const paymentRequest = {
      countryCode,
      currencyCode: 'USD',
      merchantCapabilities,
      supportedNetworks,
      requiredBillingContactFields: ['name', 'phone', 'email', 'postalAddress'],
      requiredShippingContactFields: [],
      total: {
        label: 'Demo (Card is not charged)',
        amount: '10.00',
        type: 'final',
      },
    };

    // eslint-disable-next-line no-undef
    let session = new ApplePaySession(4, paymentRequest);

    session.onvalidatemerchant = (event) => {
      applepay
        .validateMerchant({
          validationUrl: event.validationURL,
        })
        .then((payload) => {
          session.completeMerchantValidation(payload.merchantSession);
        })
        .catch((error) => {
          console.error(error);
          session.abort();
        });
    };

    session.onpaymentmethodselected = () => {
      session.completePaymentMethodSelection({
        newTotal: paymentRequest.total,
      });
    };

    session.onpaymentauthorized = async (event) => {
      try {
        /* Create Order on the Server Side */
        const orderResponse = await fetch(`/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!orderResponse.ok) {
          throw new Error('error creating order');
        }

        const { id } = await orderResponse.json();
        console.log({ id });
        /**
         * Confirm Payment
         */
        await applepay.confirmOrder({
          orderId: id,
          token: event.payment.token,
          billingContact: event.payment.billingContact,
          shippingContact: event.payment.shippingContact,
        });

        /*
         * Capture order (must currently be made on server)
         */
        await fetch(`/api/orders/${id}/capture`, {
          method: 'POST',
        });

        session.completePayment({
          status: window.ApplePaySession.STATUS_SUCCESS,
        });
      } catch (error) {
        console.error(error);
        session.completePayment({
          status: window.ApplePaySession.STATUS_FAILURE,
        });
      }
    };

    session.addEventListener('cancel', () => {
      console.log('Apple Pay Cancelled !!');
    });

    session.begin();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  if (ApplePaySession?.supportsVersion(4) && ApplePaySession?.canMakePayments()) {
    setupApplepay().catch(console.error);
  }
});

onMounted(() => {
  setupApplepay();
});
</script>
