<template>
  <div v-if="showCustomerWishComponent" class="md:px-4 py-6">
    <h2 class="w-full text-neutral-900 text-lg font-bold mb-4">
      {{ t('orderContactWish') }}
    </h2>

    <SfTextarea
      v-model="customerWish"
      class="resize-none md:!h-32 sm:!h-20 w-full"
      :placeholder="t('checkoutContactWishMessage')"
      @blur="setCustomerWish(customerWish)"
    />
  </div>
</template>

<script setup lang="ts">
import { SfTextarea } from '@storefront-ui/vue';
const { t } = useI18n();
const { setCustomerWish } = useAdditionalInformation();
const customerWish = ref('');
const config = useRuntimeConfig().public;
const showCustomerWishComponent = config.showCustomerWishComponent;
</script>
