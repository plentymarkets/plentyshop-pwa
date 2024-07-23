<template>
  <UiModal v-model="isOpen" tag="section" class="w-full h-full md:h-fit m-0 p-0 lg:w-[1000px] overflow-y-auto">
    <header>
      <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
        <span>{{ t('account.ordersAndReturns.orderAgain.heading') }}</span>
      </h2>
      <div v-if="!loading">
        <div class="font-medium" v-if="hasItemsChanged">
          {{ t('account.ordersAndReturns.orderAgain.subtextChanges') }}
        </div>
        <div class="font-medium" v-else>
          {{ t('account.ordersAndReturns.orderAgain.subtext') }}
        </div>
      </div>
      <div class="absolute right-2 top-2 flex items-center">
        <SfButton data-testid="quick-checkout-close" square variant="tertiary" @click="close">
          <SfIconClose />
        </SfButton>
      </div>
    </header>

    <div class="w-full">
      <div
        class="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 mb-4 max-h-[calc(100vh-225px)] md:max-h-[calc(100vh-270px)]"
      >
        <div v-if="!loading">
          <div
            v-for="item in orderGetters.getItems(order)"
            :key="item.id"
            class="relative flex border-neutral-200 border-b p-4"
          >
            <div class="relative overflow-hidden flex-shrink-0 rounded-md w-24 h-24 sm:h-40 sm:w-40">
              <NuxtImg
                ref="img"
                :src="
                  addModernImageExtension(orderGetters.getOrderVariationImage(order, item)) || '/images/placeholder.png'
                "
                :alt="orderGetters.getItemName(item)"
                width="300"
                height="300"
                loading="lazy"
                class="w-full h-full object-contain border rounded-md border-neutral-200"
              />
            </div>

            <div class="ml-3 w-full flex flex-col">
              <h1 class="w-fit no-underline typography-text-sm sm:typography-text-lg" data-testid="product-name">
                {{ orderGetters.getItemQty(item) }}x {{ orderGetters.getItemName(item) }}
              </h1>
              <Price
                v-if="
                  orderGetters.isItemSalableAndActive(order, item) && orderGetters.hasAllOrderPropertiesAvailable(item)
                "
                :price="orderGetters.getOrderAgainInformationPrice(item)"
                :normal-price="orderGetters.getOrderAgainInformationPrice(item)"
                :old-price="orderGetters.getItemPrice(item)"
              />
              <div
                v-if="orderGetters.getItemShortDescription(order, item)"
                class="mb-2 font-normal typography-text-sm whitespace-pre-wrap break-words text-center sm:text-left"
                data-testid="product-description"
              >
                {{ orderGetters.getItemShortDescription(order, item) }}
              </div>
              <div class="mb-2" v-if="!orderGetters.isBundleComponents(item)">
                <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
                  <li v-for="(attribute, index) in orderGetters.getOrderAttributes(item)" :key="index">
                    <span class="mr-1" v-if="orderGetters.getOrderItemAttributeName(attribute)">
                      {{ orderGetters.getOrderItemAttributeName(attribute) }}:
                    </span>
                    <span class="font-medium" v-if="orderGetters.getOrderItemAttributeValue(attribute)">
                      {{ orderGetters.getOrderItemAttributeValue(attribute) }}
                    </span>
                  </li>
                </ul>
                <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
                  <li
                    v-for="(property, index) in orderGetters.getItemOrderProperties(item)"
                    :key="index"
                    :class="{ 'line-through': !orderGetters.getOrderAgainOrderProperty(item, property) }"
                  >
                    <span class="mr-1 font-bold">
                      <span>{{ orderGetters.getItemOrderPropertyName(property) }}</span>
                      <span
                        v-if="
                          orderGetters.getOrderAgainOrderProperty(item, property) &&
                          productPropertyGetters.getOrderPropertyLabel(
                            orderGetters.getOrderAgainOrderProperty(item, property),
                          ).surchargeType
                        "
                      >
                        ({{
                          t(
                            'orderProperties.vat.' +
                              productPropertyGetters.getOrderPropertyLabel(
                                orderGetters.getOrderAgainOrderProperty(item, property),
                              ).surchargeType,
                          )
                        }}
                        {{
                          n(
                            productPropertyGetters.getOrderPropertySurcharge(
                              orderGetters.getOrderAgainOrderProperty(item, property),
                            ),
                            'currency',
                          )
                        }})</span
                      >
                      <span v-if="orderGetters.getItemOrderPropertyValue(property).length > 0">:</span>
                    </span>
                    <span class="font-medium" v-if="orderGetters.getItemOrderPropertyValue(property).length > 0">
                      {{ orderGetters.getItemOrderPropertyValue(property) }}
                    </span>
                  </li>
                </ul>
              </div>
              <div class="w-full flex flex-wrap gap-2">
                <SfListItem
                  v-if="orderGetters.getOrderAgainAvailability(item)"
                  size="sm"
                  class="text-xs font-medium rounded-md !w-fit !cursor-text !px-2 grid"
                  :class="[orderGetters.getOrderAgainAvailabilityClass(item)]"
                  :style="{
                    backgroundColor: orderGetters.getOrderAgainAvailabilityBackgroundColor(item),
                    color: orderGetters.getOrderAgainAvailabilityTextColor(item),
                  }"
                >
                  {{ orderGetters.getOrderAgainAvailabilityName(item) }}
                </SfListItem>
                <UiTag
                  v-if="!orderGetters.isItemSalableAndActive(order, item)"
                  variant="negative"
                  size="sm"
                  class="!font-medium"
                >
                  <SfIconError size="xs" />
                  <span>{{ t('account.ordersAndReturns.orderAgain.notAvailable') }}</span>
                </UiTag>
                <UiTag
                  v-else-if="!orderGetters.hasAllOrderPropertiesAvailable(item)"
                  variant="negative"
                  size="sm"
                  class="!font-medium"
                >
                  <SfIconError size="xs" />
                  <span>{{ t('account.ordersAndReturns.orderAgain.orderPropertyNotAvailableOrChanged') }}</span>
                </UiTag>
                <UiTag
                  v-else-if="orderGetters.getOrderAgainInformationPrice(item) > orderGetters.getItemPrice(item)"
                  variant="secondary"
                  size="sm"
                  class="!font-medium"
                >
                  <SfIconArrowUpward size="xs" />
                  <span>{{ t('account.ordersAndReturns.orderAgain.priceUp') }}</span>
                </UiTag>
                <UiTag
                  v-else-if="orderGetters.getOrderAgainInformationPrice(item) < orderGetters.getItemPrice(item)"
                  variant="positive"
                  size="sm"
                  class="!font-medium"
                >
                  <SfIconArrowDownward size="xs" />
                  <span>{{ t('account.ordersAndReturns.orderAgain.priceDown') }}</span>
                </UiTag>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full" v-else>
          <SkeletonsOrderAgainItem v-for="item in orderGetters.getItems(order)" :key="item.id" />
        </div>
      </div>
      <div class="h-auto flex-shrink-0 block sm:flex gap-2 relative mt-3">
        <div class="typography-text-xs flex gap-1 mb-3 sm:mb-0">
          <span>{{ t('asterisk') }}</span>
          <span v-if="showNetPrices">{{ t('itemExclVAT') }}</span>
          <span v-else>{{ t('itemInclVAT') }}</span>
          <span>{{ t('excludedShipping') }}</span>
        </div>
        <div class="ml-auto float-right">
          <SfButton class="mr-2" variant="secondary" @click="close()" size="lg">
            {{ t('account.ordersAndReturns.orderAgain.cancel') }}
          </SfButton>
          <SfButton
            data-testid="quick-checkout-cart-button"
            @click="addToCart"
            :disabled="loading || loadingAddToCart || !canAddToCart"
            size="lg"
            variant="primary"
          >
            <SfLoaderCircular v-if="loadingAddToCart" class="flex justify-center items-center" size="sm" />
            <span v-else>{{ t('account.ordersAndReturns.orderAgain.addToCart') }}</span>
          </SfButton>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import {
  SfButton,
  SfIconClose,
  SfLoaderCircular,
  SfIconError,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfListItem,
} from '@storefront-ui/vue';
import type { OrderAgainProps } from './types';
import { orderGetters, productPropertyGetters } from '@plentymarkets/shop-api';

const props = defineProps<OrderAgainProps>();
const { send } = useNotification();
const { addModernImageExtension } = useModernImage();
const { isOpen, addOrderToCart, loading, hasItemsChanged } = useOrderAgain();
const { t, n } = useI18n();
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;
const localePath = useLocalePath();
const loadingAddToCart = ref(false);

const close = () => {
  isOpen.value = false;
};

const goToPage = (path: string) => {
  close();
  navigateTo(localePath(path));
};

const canAddToCart = computed(() => {
  return orderGetters.getItems(props.order).find((item) => {
    return orderGetters.isItemSalableAndActive(props.order, item) && orderGetters.hasAllOrderPropertiesAvailable(item);
  });
});

const addToCart = async () => {
  loadingAddToCart.value = true;
  if (await addOrderToCart()) {
    send({
      type: 'positive',
      message: t('addedToCart'),
    });
    goToPage(paths.cart);
  }
  loadingAddToCart.value = false;
};
</script>
