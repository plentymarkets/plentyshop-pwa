<template>
  <div class="mb-3">
    <Price :price="priceWithProperties" :crossed-price="crossedPrice" :crossed-price-value="crossedPriceValue" />
    <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
      <UiTag :size="'sm'" :variant="'secondary'">{{
        $t('procentageSavings', { percent: productBundleGetters.getBundleDiscount(product) })
      }}</UiTag>
    </div>
  </div>
  <LowestPrice :product="product" />
  <BasePrice
    v-if="productGetters.showPricePerUnit(product)"
    :base-price="basePriceSingleValue"
    :unit-content="productGetters.getUnitContent(product)"
    :unit-name="productGetters.getUnitName(product)"
  />
</template>

<script setup lang="ts">
import { productBundleGetters, productGetters } from '@plentymarkets/shop-api';
import type { ProductPriceProps } from '~/components/ProductPrice/types';

const props = defineProps<ProductPriceProps>();

const { basePriceSingleValue, crossedPrice, crossedPriceValue, priceWithProperties } = useProductPrice(props.product);
</script>
