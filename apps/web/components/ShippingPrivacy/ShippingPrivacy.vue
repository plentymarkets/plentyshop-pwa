<template>
  <ClientOnly>
    <div
      v-if="selectedMethod && shippingProviderGetters.getDataPrivacyAgreementHint(selectedMethod)"
      class="my-6 md:col-span-3 flex items-start gap-2"
    >
      <SfCheckbox
        id="checkbox"
        :value="shippingPrivacyAgreement"
        class="mt-1"
        name="Shipping Privacy"
        :selected="shippingPrivacyAgreement"
        @update:model-value="(event) => changeHint(Boolean(event))"
      />
      <label for="checkbox" class="cursor-pointer select-none">
        {{ $t('shippingMethod.showDataPrivacyAgreementHint', { parcelServiceInformation }) }}
      </label>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { shippingProviderGetters } from '@plentymarkets/shop-api';
import { SfCheckbox } from '@storefront-ui/vue';

const { shippingPrivacyAgreement, setShippingPrivacyAgreement } = useAdditionalInformation();
const { selectedMethod } = useCartShippingMethods();

const parcelServiceInformation = computed(() => {
  return selectedMethod.value ? shippingProviderGetters.getShippingMethodName(selectedMethod.value) : '';
});

const changeHint = (value: boolean) => {
  setShippingPrivacyAgreement(value);
};
</script>
