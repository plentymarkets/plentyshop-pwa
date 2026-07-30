<template>
  <div v-if="showCustomerReferenceComponent" class="@md:px-4 py-6">
    <h2 class="w-full text-neutral-900 text-lg font-bold mb-4">
      {{ t('checkout.fields.customerReference') }}
    </h2>

    <SfInput
      v-model="customerSign"
      :placeholder="t('checkout.fields.customerReferencePlaceholder')"
      @blur="setCustomerSign(customerSign)"
    />
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
const { getBooleanSetting } = useSiteSettings('showCustomerReferenceComponent');
const { setCustomerSign } = useAdditionalInformation();
const showCustomerReferenceComponent = computed(() => getBooleanSetting());
const customerSign = ref('');
</script>
