<script setup lang="ts">
import { SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { t } from '#imports';
import { useSkuToCart } from '../composables/useSkuToCart';

const { sku, formKey, loading, setQuantity, submit } = useSkuToCart();
</script>

<template>
  <form class="flex items-center gap-2" @submit.prevent="submit">
    <SfInput
      v-model="sku"
      :disabled="loading"
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
</template>
