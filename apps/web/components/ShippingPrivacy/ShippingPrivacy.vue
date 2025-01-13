<template>
  <div class="mt-6 md:col-span-3 flex items-start gap-2" :class="[!showErrors ? 'mb-6' : 'mb-2']">
    <SfCheckbox
      id="shipping-agreement-checkbox"
      :value="shippingPrivacyAgreement"
      :selected="shippingPrivacyAgreement"
      :invalid="showErrors"
      class="mt-1"
      name="Shipping Privacy"
      @update:model-value="(event) => setShippingPrivacyAgreement(Boolean(event))"
    />
    <label for="shipping-agreement-checkbox" class="cursor-pointer select-none">
      {{ $t('shippingMethod.showDataPrivacyAgreementHint', { parcelServiceInformation }) }}
    </label>
  </div>
  <div v-if="showErrors" class="text-negative-700 text-sm mb-4">{{ $t('privacyPolicyRequired') }}</div>
</template>

<script lang="ts" setup>
import { shippingProviderGetters } from '@plentymarkets/shop-api';
import { SfCheckbox } from '@storefront-ui/vue';

const { shippingPrivacyAgreement, showErrors, setShippingPrivacyAgreement } = useAdditionalInformation();
const { selectedMethod } = useCartShippingMethods();

const parcelServiceInformation = computed(() =>
  selectedMethod.value ? shippingProviderGetters.getShippingMethodName(selectedMethod.value) : '',
);
</script>
