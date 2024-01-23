<template>
  <div>
    <ProductListItem
      :path="path"
      :base-price-single-value="basePriceSingleValue"
      :cart-item-image="cartItemImage"
      :current-full-price="currentFullPrice"
      :cart-item="cartItem"
    />
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-sdk';
import { productGetters } from '@plentymarkets/shop-sdk';
import type { CartProductCardProps } from '~/components/ui/CartProductCard/types';

const localePath = useLocalePath();

const props = withDefaults(defineProps<CartProductCardProps>(), {
  disabled: false,
});

const currentFullPrice = computed(() => {
  return cartGetters.getCartItemPrice(props.cartItem) * cartGetters.getItemQty(props.cartItem);
});

const cartItemImage = computed(() => cartGetters.getItemImage(props.cartItem));

const basePriceSingleValue = computed(() =>
  props.cartItem?.variation
    ? productGetters.getGraduatedPriceByQuantity(props.cartItem.variation, props.cartItem.quantity)?.baseSinglePrice ??
      productGetters.getDefaultBaseSinglePrice(props.cartItem.variation)
    : 0,
);

const path = computed(() => localePath('/' + cartGetters.getProductPath(props.cartItem)));
</script>
