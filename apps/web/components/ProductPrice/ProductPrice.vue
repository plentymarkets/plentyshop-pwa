<template>
  <div class="mb-3">
    <Price
      :price="currentActualPrice"
      :normal-price="normalPrice"
      :old-price="productGetters.getPrice(product).regular ?? 0"
    />
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

const { getPropertiesPrice } = useProductOrderProperties();

const currentActualPrice = computed(
  () =>
    (productGetters.getGraduatedPriceByQuantity(props.product, 1)?.price.value ??
      productGetters.getPrice(props.product)?.special ??
      productGetters.getPrice(props.product)?.regular ??
      0) + getPropertiesPrice(props.product),
);

const normalPrice =
  productGetters.getGraduatedPriceByQuantity(props.product, 1)?.price.value ??
  productGetters.getPrice(props.product)?.special ??
  productGetters.getPrice(props.product)?.regular ??
  0;

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props.product, 1)?.baseSinglePrice ??
    productGetters.getDefaultBaseSinglePrice(props.product),
);
</script>
