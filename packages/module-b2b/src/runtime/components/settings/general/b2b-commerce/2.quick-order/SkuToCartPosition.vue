<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { getEditorTranslation } from '#imports';
import { useSkuToCartPosition } from '../../../../../composables/useSkuToCartPosition';

const { position } = useSkuToCartPosition();
</script>

<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <UiFormLabel for="sku-to-cart-position">{{ getEditorTranslation('label') }}</UiFormLabel>
    <SfSelect id="sku-to-cart-position" v-model="position" data-testid="sku-to-cart-position" class="w-full mt-2">
      <option value="none">{{ getEditorTranslation('none') }}</option>
      <option value="aboveCoupon">{{ getEditorTranslation('above-coupon') }}</option>
      <option value="belowCoupon">{{ getEditorTranslation('below-coupon') }}</option>
    </SfSelect>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "description": "Let customers add items to the cart by entering an SKU and a quantity.",
    "label": "Show the SKU form",
    "none": "Do not show",
    "above-coupon": "Above the coupon field",
    "below-coupon": "Below the coupon field"
  },
  "de": {
    "description": "Let customers add items to the cart by entering an SKU and a quantity.",
    "label": "Show the SKU form",
    "none": "Do not show",
    "above-coupon": "Above the coupon field",
    "below-coupon": "Below the coupon field"
  }
}
</i18n>
