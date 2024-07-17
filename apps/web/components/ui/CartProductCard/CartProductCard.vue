<template>
  <div class="relative flex border-neutral-200 border-b min-w-[320px] p-4 last:mb-0" data-testid="cart-product-card">
    <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
      <SfLink :tag="NuxtLink" :to="path" class="flex items-center justify-center">
        <NuxtImg
          ref="img"
          :src="addModernImageExtension(cartItemImage) || '/images/placeholder.png'"
          :alt="cartGetters.getItemName(cartItem)"
          width="300"
          height="300"
          loading="lazy"
          class="w-full h-auto border rounded-md border-neutral-200"
        />
        <SfLoaderCircular v-if="!imageLoaded" class="absolute" size="sm" />
      </SfLink>
    </div>
    <div class="flex flex-col pl-4 min-w-[180px] flex-1">
      <SfLink
        :tag="NuxtLink"
        :to="path"
        variant="secondary"
        class="w-fit no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ cartGetters.getItemName(cartItem) }}
      </SfLink>

      <div v-if="!cartItem.variation?.bundleComponents">
        {{ n(cartGetters.getCartItemPrice(cartItem), 'currency') }}
      </div>

      <UiBadges v-if="cartItem.variation" :product="cartItem.variation" :use-availability="true" />

      <div v-if="!cartItem.variation?.bundleComponents">
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
          <div v-if="cartGetters.getVariation(cartItem)">
            <VariationProperties :product="cartGetters.getVariation(cartItem)" />
          </div>
        </div>
      </div>
      <div v-if="cartItem.variation?.bundleComponents" class="my-2 mb-6">
        <div v-for="(item, index) in cartItem.variation.bundleComponents" :key="index">
          <SfLink
            :tag="NuxtLink"
            v-if="productBundleGetters.isItemBundleSalable(item)"
            :to="localePath(productBundleGetters.getBundleItemUrl(item))"
            variant="secondary"
            class="no-underline typography-text-sm"
          >
            <p>
              {{ productBundleGetters.getBundleItemQuantity(item) }}x
              <span class="underline px-1 h-">{{ productBundleGetters.getBundleItemName(item) }}</span>
            </p>
          </SfLink>
          <p class="text-sm" v-else>
            {{ productBundleGetters.getBundleItemQuantity(item) }}x
            <span class="px-1 h-">{{ productBundleGetters.getBundleItemName(item) }}</span>
          </p>
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

    <div v-if="deleteLoading" class="absolute top-2 right-2 bg-white p-1.5">
      <SfLoaderCircular />
    </div>

    <SfButton
      v-else-if="!disabled"
      @click="deleteItem"
      square
      variant="tertiary"
      size="sm"
      class="absolute top-2 right-2 bg-white"
    >
      <SfIconClose size="sm" />
    </SfButton>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productBundleGetters, cartGetters } from '@plentymarkets/shop-api';
import { SfLink, SfLoaderCircular, SfIconClose, SfButton } from '@storefront-ui/vue';
import _ from 'lodash';
import type { CartProductCardProps } from '~/components/ui/CartProductCard/types';

const { addModernImageExtension, getImageForViewport } = useModernImage();
const { setCartItemQuantity, deleteCartItem } = useCart();
const { send } = useNotification();
const { t, n } = useI18n();
const localePath = useLocalePath();
const imageLoaded = ref(false);
const img = ref();
const deleteLoading = ref(false);
const emit = defineEmits(['load']);

const props = withDefaults(defineProps<CartProductCardProps>(), {
  disabled: false,
});

onMounted(() => {
  const imgElement = (img.value?.$el as HTMLImageElement) || null;

  if (imgElement) {
    if (!imageLoaded.value) {
      if (imgElement.complete) imageLoaded.value = true;
      imgElement.addEventListener('load', () => (imageLoaded.value = true));
    }

    nextTick(() => {
      if (!imgElement.complete) emit('load');
    });
  }
});

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
const cartItemImage = computed(() => {
  if (props.cartItem && props.cartItem.variation) {
    return getImageForViewport(props.cartItem.variation, 'CartProductCard');
  }
  return '';
});

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
