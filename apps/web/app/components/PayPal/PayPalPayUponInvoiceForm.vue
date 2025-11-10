<template>
  <header>
    <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-6">
      {{ t('checkoutPayment.payUponInvoice') }}
    </h3>

    <UiButton
      v-if="!disableCloseButton"
      :aria-label="t('closeDialog')"
      type="button"
      square
      variant="tertiary"
      class="absolute right-2 top-2"
      @click="emit('confirmCancel')"
    >
      <SfIconClose />
    </UiButton>
  </header>

  <form class="grid grid-cols-1" novalidate @submit.prevent="validateAndSubmitForm">
    <label>
      <UiFormLabel class="flex">{{ t('checkoutPayment.birthdateLabel') }} &#8727;</UiFormLabel>
      <SfInput
        v-model="birthDate"
        label="Phone Number"
        type="date"
        autocomplete="bday"
        :wrapper-class="{ 'ring-2 !ring-negative-700': !validBirthDate }"
      />
    </label>

    <div class="h-[2rem] mt-1">
      <div v-if="!validBirthDate" class="text-sm text-negative-700">
        {{ t('checkoutPayment.birthdateError') }}
      </div>
    </div>

    <UiTelephoneInput
      v-model="phoneWithPrefix"
      :label="`${t('checkoutPayment.phoneLabel')} &#8727;`"
      :default-country="defaultCountry"
      :error="phoneError"
      @valid-phone-number="handlePhoneNumberValidation"
    />

    <div
      id="paypal-legal-container"
      class="text-sm text-neutral-800 mb-4 [&_a]:text-primary-300 [&_a:hover]:underline"
    />

    <div class="text-sm text-neutral-500">&#8727; {{ t('contact.form.asterixHint') }}</div>

    <div class="flex justify-end gap-x-4">
      <UiButton type="button" :disabled="disableCloseButton" variant="secondary" @click="emit('confirmCancel')">
        {{ t('paypal.unbrandedCancel') }}
      </UiButton>

      <UiButton type="submit" :disabled="loading" class="min-w-[120px] w-fit">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <template v-else>{{ t('paypal.unbrandedPay') }}</template>
      </UiButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { ApiError } from '@plentymarkets/shop-api';
import { SfIconClose, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const emit = defineEmits(['confirmCancel']);

const { t } = useI18n();
const {
  config,
  fraudId,
  loadConfig,
  getScript,
  createTransaction,
  createPlentyOrder,
  createPlentyPaymentFromPayPalOrder,
} = usePayPal();
const { emit: plentyEmit } = usePlentyEvent();
const localePath = useLocalePath();
const { processingOrder } = useProcessingOrder();
const {
  loading,
  submitFirstTime,
  birthDate,
  validBirthDate,
  phoneWithPrefix,
  validPhone,
  phoneError,
  phoneNumber,
  phoneCountryCode,
  fraudNet,
  currency,
  defaultCountry,
  isDateValid,
  handlePhoneNumberValidation,
} = usePayUponInvoice();
const disableCloseButton = computed(() => processingOrder.value || loading.value);

const fetchDependencies = async () => {
  await loadConfig().then(() => (fraudNet.value.merchantId = config.value?.merchantId || null));
  fraudNet.value.fraudId = fraudId.value;
  await insertLegalText();
};

const insertLegalText = async () => {
  const payPalScript = await getScript(currency.value, true);
  // @ts-expect-error Legal method exists but not typed in PayPal SDK
  if (payPalScript && payPalScript.Legal) {
    payPalScript
      // @ts-expect-error Legal method exists but not typed in PayPal SDK
      .Legal({
        // @ts-expect-error Legal method exists but not typed in PayPal SDK
        fundingSource: payPalScript.Legal.FUNDING.PAY_UPON_INVOICE,
      })
      .render('#paypal-legal-container');
  }
};

const insertFraudNetScript = () => {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'application/json';
  scriptTag.setAttribute('fncls', 'fnparams-dede7cc5-15fd-4c75-a9f4-36c430ee3a99');
  scriptTag.textContent = JSON.stringify({
    f: fraudNet.value.fraudId,
    s: `${fraudNet.value.merchantId}_${fraudNet.value.pageId}`,
    sandbox: config.value?.isSandbox ?? true,
  });

  document.body.appendChild(scriptTag);

  const loader = document.createElement('script');
  loader.src = 'https://c.paypal.com/da/r/fb.js';
  loader.async = true;
  document.body.appendChild(loader);
};

const validateAndSubmitForm = async () => {
  if (submitFirstTime.value) {
    validBirthDate.value = isDateValid();
    if (!validPhone.value) phoneError.value = t('checkoutPayment.phoneError');
    submitFirstTime.value = false;
  }

  if (!validBirthDate.value || !validPhone.value) return;

  await createPayPalPayUponInvoiceOrder();
};

const createPayPalPayUponInvoiceOrder = async () => {
  loading.value = true;

  try {
    const orderData = {
      type: 'basket' as const,
      additionalInformation: {
        birthdate: birthDate.value,
        phoneNumber: phoneNumber.value,
        phoneCountryCode: phoneCountryCode.value,
      },
    };

    if (!(await useCartStockReservation().reserve())) {
      loading.value = false;
      return;
    }

    const transactionOrder = await createTransaction(orderData);

    if (transactionOrder) {
      const plentyOrder = await createPlentyOrder();
      if (plentyOrder) {
        await createPlentyPaymentFromPayPalOrder(transactionOrder.id, plentyOrder.order.id);
        emit('confirmCancel');
        plentyEmit('frontend:orderCreated', plentyOrder);
        plentyEmit('module:clearCart', null);
        processingOrder.value = true;
        return navigateTo(
          localePath(paths.confirmation + '/' + plentyOrder.order.id + '/' + plentyOrder.order.accessKey),
        );
      }
    }

    await useCartStockReservation().unreserve();

    loading.value = false;
  } catch (error) {
    await useCartStockReservation().unreserve();
    loading.value = false;
    useHandleError(error as ApiError);
  }
};

onNuxtReady(async () => {
  await fetchDependencies();
  if (fraudNet.value.merchantId && fraudNet.value.fraudId) insertFraudNetScript();
});

watch(validPhone, (updatedStatus) => {
  phoneError.value = !submitFirstTime.value && !updatedStatus ? t('checkoutPayment.phoneError') : '';
});

watch(birthDate, () => {
  if (!submitFirstTime.value) validBirthDate.value = isDateValid();
});
</script>
