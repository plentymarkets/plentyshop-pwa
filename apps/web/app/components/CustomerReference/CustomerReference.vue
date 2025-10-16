<template>
  <div v-if="showCustomerReferenceComponent" class="md:px-4 py-6">
    <h2 class="w-full text-neutral-900 text-lg font-bold mb-4">
      {{ t('customerReference') }}
    </h2>

    <SfInput :placeholder="t('customerReferencePlaceholder')" />
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
const { t } = useI18n();
const { getSetting } = useSiteSettings('showCustomerReferenceComponent');
const showCustomerReferenceComponent = getSetting();
</script>
