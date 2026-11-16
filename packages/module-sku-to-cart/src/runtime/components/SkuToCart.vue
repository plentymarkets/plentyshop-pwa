<script setup lang="ts">
import { SfAccordionItem, SfIconChevronLeft, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { t } from '#imports';
import extensionConfig from '../extension.config';
import { useSkuToCart } from '../composables/useSkuToCart';

const opened = ref(false);
const { sku, formKey, loading, setQuantity, submit } = useSkuToCart();
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
        <form class="flex items-center gap-2 mb-4" @submit.prevent="submit">
          <SfInput
            v-model="sku"
            wrapper-class="flex-grow min-w-0"
            :placeholder="t('skuToCart.skuPlaceholder')"
            :aria-label="t('skuToCart.skuLabel')"
            type="text"
            name="sku"
            data-testid="sku-to-cart-sku"
          />
          <!-- The shop's selector is 48px high by default; the input is reduced to match the other fields. -->
          <UiQuantitySelector
            :key="formKey"
            :disabled="loading"
            class="shrink-0 [&_input]:!h-10"
            @change-quantity="setQuantity"
          />
          <UiButton
            type="submit"
            variant="secondary"
            class="relative whitespace-nowrap"
            :aria-label="t('skuToCart.addToCartLabel')"
            :disabled="loading || !sku.trim()"
            data-testid="sku-to-cart-submit"
          >
            <!-- The text stays in place (hidden while loading) so the button does not change its size. -->
            <span :class="{ invisible: loading }">{{ t('skuToCart.addToCart') }}</span>
            <SfLoaderCircular v-if="loading" class="absolute inset-0 m-auto" size="sm" />
          </UiButton>
        </form>
      </SfAccordionItem>
    </div>
  </ExtensionBoundary>
</template>
