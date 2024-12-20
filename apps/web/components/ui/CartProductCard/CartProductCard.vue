<template>
  <div class="relative flex border-neutral-200 border-b min-w-[320px] py-4 last:mb-0" data-testid="cart-product-card">
    <div class="grid grid-cols-3 lg:grid-cols-5 items-start min-w-[180px] flex-1">
      <div class="flex mb-[-13%] lg:mb-0 col-span-3 pr-10 lg:pr-2">
        <div class="relative overflow-hidden w-[100px] sm:w-[128px] kl-card-image-zoom">
          <SfLink :tag="NuxtLink" :to="path" class="flex items-center justify-center ">
            <NuxtImg
                     ref="img"
                     :src="addModernImageExtension(cartItemImage) || '/images/placeholder.png'"
                     :alt="cartGetters.getItemName(cartItem)"
                     width=""
                     height=""
                     loading="lazy"
                     class="w-full h-auto" />
            <SfLoaderCircular v-if="!imageLoaded" class="absolute" size="sm" />
          </SfLink>
        </div>

        <div class="pl-4">
          <SfLink
                  :tag="NuxtLink"
                  :to="path"
                  variant="secondary"
                  class="w-fit no-underline g-12 lg:g-16 mt-2 block">
            {{ cartGetters.getItemName(cartItem) }}
          </SfLink>

          <p class="g-12-m lg:g-16-m mt-1">
            Einzelpreis: {{ n(cartItem.price, 'currency') }}
          </p>

          <div v-if="!cartItem.variation?.bundleComponents">
            {{ n(cartGetters.getCartItemPrice(cartItem), 'currency') }}
          </div>

          <!-- <UiBadges v-if="cartItem.variation" :product="cartItem.variation" :use-availability="true" /> -->

          <div v-if="!cartItem.variation?.bundleComponents">
            <div v-if="cartItem.variation" class="mt-2">
              <BasePrice
                         v-if="productGetters.showPricePerUnit(cartItem.variation)"
                         :base-price="basePriceSingleValue"
                         :unit-content="productGetters.getUnitContent(cartItem.variation)"
                         :unit-name="productGetters.getUnitName(cartItem.variation)" />
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
                   v-if="cartItem.basketItemOrderParams.length > 0">
                <div class="text-[15px]">{{ t('orderProperties.additionalCostsPerItem') }}:</div>
                <CartOrderProperty
                                   v-for="property in cartItem.basketItemOrderParams"
                                   :key="property.propertyId"
                                   :cart-item="cartItem"
                                   :basket-item-order-param="property" />
              </div>
              <div
                   v-if="cartGetters.getVariation(cartItem)"
                   class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700 mt-3">
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
                      class="no-underline typography-text-sm">
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
        </div>
      </div>

      <div class="col-start-2 lg:col-start-4">
        <UiQuantitySelector
                            ref="quantitySelectorReference"
                            :disabled="disabled"
                            @change-quantity="debounceQuantity"
                            :value="itemQuantitySelector"
                            :min-value="productGetters.getMinimumOrderQuantity(cartItem.variation || ({} as Product))"
                            :max-value="maximumOrderQuantity"
                            class="mt-4 sm:mt-0" />
      </div>

      <span
            v-if="currentFullPrice"
            class="sm:order-1 g-12 lg:g-16 text-right mt-auto lg:mt-0">
        {{ n(currentFullPrice || 0, 'currency') }}
      </span>
    </div>

    <div v-if="deleteLoading" class="absolute top-2 right-2 bg-white p-1.5">
      <SfLoaderCircular aria-label="loading" />
    </div>

    <UiButton
              v-else-if="!disabled"
              @click="deleteItem"
              square
              :aria-label="t('removeItemFromBasket')"
              variant="tertiary"
              size="sm"
              class="absolute top-2 lg:top-auto lg:bottom-2 right-0 bg-white">
      <SfIconDelete size="base" class="text-black" />
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productBundleGetters, cartGetters } from '@plentymarkets/shop-api';
import { SfLink, SfLoaderCircular, SfIconDelete } from '@storefront-ui/vue';
import type { CartProductCardProps } from '~/components/ui/CartProductCard/types';
import type { Product } from '@plentymarkets/shop-api';
import _ from 'lodash';

const { cartItem, disabled = false } = defineProps<CartProductCardProps>();
const emit = defineEmits(['load']);

const { addModernImageExtension, getImageForViewport } = useModernImage();
const { data: cartData, setCartItemQuantity, deleteCartItem } = useCart();
const { send } = useNotification();
const { t, n } = useI18n();
const localePath = useLocalePath();

const imageLoaded = ref(false);
const img = ref();
const deleteLoading = ref(false);
const quantitySelectorReference = ref(null as any);
const itemQuantitySelector = ref(cartGetters.getItemQty(cartItem));
const maximumOrderQuantity = ref();

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

const handleMaximumQuantityCheck = async (quantityCast: number) => {
  if (!cartData.value?.itemQuantity || quantityCast <= cartData.value.itemQuantity) {
    maximumOrderQuantity.value = undefined;
    return;
  }

  maximumOrderQuantity.value = cartData.value.itemQuantity;

  if (quantitySelectorReference.value) {
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: maximumOrderQuantity.value },
      writable: true,
    });
    quantitySelectorReference.value.handleOnChange(event);
  }

  await setCartItemQuantity({
    quantity: maximumOrderQuantity.value,
    cartItemId: cartItem.id,
    productId: cartItem.variationId,
  });
};

const changeQuantity = async (quantity: string) => {
  const quantityCast = Number(quantity);
  if (Number.isNaN(quantityCast) || quantityCast === cartData.value.itemQuantity) return;

  await setCartItemQuantity({
    quantity: quantityCast,
    cartItemId: cartItem.id,
    productId: cartItem.variationId,
  }).then(async () => await handleMaximumQuantityCheck(quantityCast));
};

const deleteItem = async () => {
  deleteLoading.value = true;
  await deleteCartItem({
    cartItemId: cartItem.id,
  });
  send({ message: t('deletedFromCart'), type: 'positive' });
  deleteLoading.value = false;
};

const currentFullPrice = computed(() => {
  return cartGetters.getCartItemPrice(cartItem) * cartGetters.getItemQty(cartItem);
});

const cartItemImage = computed(() => {
  if (cartItem && cartItem.variation) {
    return getImageForViewport(cartItem.variation, 'CartProductCard');
  }
  return '';
});

const debounceQuantity = _.debounce(changeQuantity, 500);

const NuxtLink = resolveComponent('NuxtLink');

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(cartItem.variation ?? ({} as Product), cartItem.quantity)?.basePrice ??
    productGetters.getDefaultBasePrice(cartItem.variation ?? ({} as Product)),
);

const path = computed(() => localePath('/' + cartGetters.getProductPath(cartItem)));
</script>
