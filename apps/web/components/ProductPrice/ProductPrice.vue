<template>
  <div class="mb-3">
    <Price :price="price" :crossed-price="crossedPrice" />
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
import { getPrice, getCrossedPrice, getSpecialOffer } from '~/utils/pricesHelper';

const props = defineProps<ProductPriceProps>();

const { getPropertiesPrice } = useProductOrderProperties();

const price = computed(
  () =>
    (getSpecialOffer(props.product) || productGetters.getGraduatedPriceByQuantity(props.product, 1)?.price.value || 0) +
    getPropertiesPrice(props.product),
);

const crossedPrice = computed(
  () => (getSpecialOffer(props.product) ? getPrice(props.product) : getCrossedPrice(props.product)) || undefined,
);

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props.product, 1)?.basePrice ??
    productGetters.getDefaultBasePrice(props.product),
);
</script>
