<template>
  <div
    v-if="deliveryCountry && shopCountry"
    class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md mb-4"
  >
    <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
    <div class="py-2 mr-2">
      {{
        t('checkoutExportDelivery', {
          shopCountry: shopCountry,
          deliveryCountry: deliveryCountry,
        })
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconWarning } from '@storefront-ui/vue';
import { cartGetters } from '@plentymarkets/shop-api';

const { t } = useI18n();
const { data: cart } = useCart();
const { default: shippingCountries } = useAggregatedCountries();

const shopCountry = computed(() => {
  return shippingCountries.value.find((country) => country.id === cartGetters.getShopCountryId(cart.value))
    ?.currLangName;
});
const deliveryCountry = computed(() => {
  return shippingCountries.value.find((country) => country.id === cartGetters.getShippingCountryId(cart.value))
    ?.currLangName;
});
</script>
