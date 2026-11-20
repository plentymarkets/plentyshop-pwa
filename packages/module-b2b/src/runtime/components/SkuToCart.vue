<script setup lang="ts">
import { SfAccordionItem, SfIconChevronLeft } from '@storefront-ui/vue';
import { t } from '#imports';
import extensionConfig from '../extension.config';

const opened = ref(false);
</script>

<template>
  <ExtensionBoundary :name="extensionConfig.name">
    <!-- Same look as the coupon field of the cart. -->
    <div class="w-full max-w-2xl border-b border-neutral-200">
      <SfAccordionItem v-model="opened" data-testid="sku-to-cart">
        <template #summary>
          <div :class="['flex justify-between font-medium p-3', { 'my-4 bg-gray-100 rounded-md': opened }]">
            <p class="pl-3">{{ t('skuToCart.title') }}</p>
            <SfIconChevronLeft :class="['text-neutral-500', { 'rotate-90': opened, '-rotate-90': !opened }]" />
          </div>
        </template>
        <SkuToCartForm class="mb-4" />
      </SfAccordionItem>
    </div>
  </ExtensionBoundary>
</template>
