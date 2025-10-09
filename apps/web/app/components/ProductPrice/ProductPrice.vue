<template>
  <div class="mb-3">
    <Price :price="priceWithProperties" :crossed-price="crossedPrice" />
    <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
      <UiTag :size="'sm'" :variant="'secondary'">{{
        t('procentageSavings', { percent: productBundleGetters.getBundleDiscount(product) })
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
import { productBundleGetters, productGetters, cartGetters } from '@plentymarkets/shop-api';
import type { ProductPriceProps } from '~/components/ProductPrice/types';

const props = defineProps<ProductPriceProps>();

const { t } = useI18n();
const { getPropertiesPrice } = useProductOrderProperties();
const { crossedPrice } = useProductPrice(props.product);
const { lastUpdatedCartItem } = useCart();

const priceWithProperties = computed(
  () =>
    (productGetters.getSpecialOffer(props.product) ||
      productGetters.getGraduatedPriceByQuantity(props.product, cartGetters.getItemQty(lastUpdatedCartItem.value))
        ?.unitPrice.value ||
      0) + getPropertiesPrice(props.product),
);

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props.product, cartGetters.getItemQty(lastUpdatedCartItem.value))
      ?.basePrice ?? productGetters.getDefaultBasePrice(props.product),
);
</script>
