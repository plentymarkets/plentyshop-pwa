<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] p-4 last:mb-0"
    data-testid="cart-product-card"
  >
    <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
      <SfLink :tag="NuxtLink" :to="path">
        <!-- TODO: replace default image with an appropriate one.-->
        <NuxtImg
          class="w-full h-auto border rounded-md border-neutral-200"
          :src="addWebpExtension(cartItemImage) || '/images/placeholder.png'"
          :alt="cartItemImage || ''"
          width="300"
          height="300"
          loading="lazy"
          format="webp"
        />
      </SfLink>
    </div>
    <div class="flex flex-col pl-4 min-w-[180px] flex-1">
      <SfLink
        :tag="NuxtLink"
        :to="path"
        variant="secondary"
        class="no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ cartGetters.getItemName(cartItem) }}
      </SfLink>
      <div>{{ n(cartGetters.getCartItemPrice(cartItem), 'currency') }}</div>
      <div v-if="cartItem.variation" class="mt-2">
        <BasePrice
          v-if="productGetters.showPricePerUnit(cartItem.variation)"
          :base-price="basePriceSingleValue"
          :unit-content="productGetters.getUnitContent(cartItem.variation)"
          :unit-name="productGetters.getUnitName(cartItem.variation)"
        />
      </div>
      <div class="my-2">
        <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="attribute in cartGetters.getItemAttributes(cartItem)" :key="attribute.name">
            <span class="mr-1">{{ attribute.label }}:</span>
            <span class="font-medium">{{ attribute.value }}</span>
          </li>
        </ul>

        <div
          class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700"
          v-if="cartItem.basketItemOrderParams.length > 0"
        >
          <div class="text-[15px]">{{ t('orderProperties.additionalCostsPerItem') }}:</div>
          <ul>
            <CartOrderProperty
              v-for="property in cartItem.basketItemOrderParams"
              :key="property.propertyId"
              :cart-item="cartItem"
              :basket-item-order-param="property"
            />
          </ul>
        </div>
      </div>

      <div class="items-start sm:items-center sm:mt-auto flex flex-col sm:flex-row">
        <span
          v-if="currentFullPrice"
          class="text-secondary-700 sm:order-1 font-bold typography-text-sm sm:typography-text-lg sm:ml-auto"
        >
          {{ n(currentFullPrice || 0, 'currency') }}
        </span>
        <UiQuantitySelector
          :disabled="disabled"
          @change-quantity="debounceQuantity"
          :value="cartGetters.getItemQty(cartItem)"
          :min-value="1"
          class="mt-4 sm:mt-0"
        />
      </div>
    </div>
    <SfLoaderCircular v-if="deleteLoading" />
    <SfIconDelete v-else-if="!disabled" class="cursor-pointer" @click="deleteItem" />
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-sdk';
import { productGetters } from '@plentymarkets/shop-sdk';
import { SfLink, SfIconDelete, SfLoaderCircular } from '@storefront-ui/vue';
import _ from 'lodash';
import type { CartProductCardProps } from '~/components/ui/CartProductCard/types';

const { addWebpExtension } = useImageUrl();
const { setCartItemQuantity, deleteCartItem } = useCart();
const { send } = useNotification();
const { t, n } = useI18n();
const localePath = useLocalePath();

const props = withDefaults(defineProps<CartProductCardProps>(), {
  disabled: false,
});
const deleteLoading = ref(false);
const changeQuantity = async (quantity: string) => {
  await setCartItemQuantity({
    quantity: Number(quantity),
    cartItemId: props.cartItem.id,
    productId: props.cartItem.variationId,
  });
};
const deleteItem = async () => {
  deleteLoading.value = true;
  await deleteCartItem({
    cartItemId: props.cartItem.id,
  });
  send({ message: t('deletedFromCart'), type: 'positive' });
  deleteLoading.value = false;
};

const currentFullPrice = computed(() => {
  return cartGetters.getCartItemPrice(props.cartItem) * cartGetters.getItemQty(props.cartItem);
});

const cartItemImage = computed(() => cartGetters.getItemImage(props.cartItem));

const debounceQuantity = _.debounce(changeQuantity, 500);

const NuxtLink = resolveComponent('NuxtLink');

const basePriceSingleValue = computed(() =>
  props.cartItem?.variation
    ? productGetters.getGraduatedPriceByQuantity(props.cartItem.variation, props.cartItem.quantity)?.baseSinglePrice ??
      productGetters.getDefaultBaseSinglePrice(props.cartItem.variation)
    : 0,
);

const path = computed(() => localePath('/' + cartGetters.getProductPath(props.cartItem)));
</script>
