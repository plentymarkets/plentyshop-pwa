<template>
  <UiModal v-model="isOpen" tag="section" class="w-full h-full md:h-fit m-0 p-0 lg:w-[1000px] overflow-y-auto">
    <header>
      <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
        <span>{{ t('account.ordersAndReturns.orderAgain.heading') }}</span>
      </h2>
      <div class="font-medium">{{ t('account.ordersAndReturns.orderAgain.subtext') }}</div>
      <div class="absolute right-2 top-2 flex items-center">
        <SfButton data-testid="quick-checkout-close" square variant="tertiary" @click="close">
          <SfIconClose />
        </SfButton>
      </div>
    </header>

    <div class="w-full">
      <div class="overflow-y-scroll mb-4 max-h-[calc(100vh-205px)] md:max-h-[calc(100vh-270px)]">
        <div v-if="!loading">
          <div
            v-for="item in orderGetters.getItems(order)"
            :key="item.id"
            class="flex w-full mt-6 flex-col items-center sm:flex-row"
          >
            <div class="w-40 h-40 flex-shrink-0 flex-grow-0 mr-4">
              <NuxtImg
                :src="addModernImageExtension(orderGetters.getOrderVariationImage(order, item))"
                alt="Test"
                class="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            <div class="w-full flex items-center flex-col sm:block">
              <h1
                class="font-bold typography-headline-4 break-words text-center sm:text-left"
                data-testid="product-name"
              >
                {{ orderGetters.getItemQty(item) }}x {{ orderGetters.getItemName(item) }}
              </h1>
              <Price
                v-if="orderGetters.getOrderAgainInformationPrice(item) > 0"
                :price="orderGetters.getOrderAgainInformationPrice(item)"
                :normal-price="orderGetters.getOrderAgainInformationPrice(item)"
                :old-price="orderGetters.getItemPrice(item)"
              />
              <div
                class="mb-2 font-normal typography-text-sm whitespace-pre-wrap break-words text-center sm:text-left"
                data-testid="product-description"
              >
                {{ orderGetters.getItemShortDescription(order, item) }}
              </div>
              <div class="w-full flex flex-wrap justify-center gap-2 sm:justify-normal">
                <SfListItem
                  v-if="orderGetters.getOrderAgainAvailability(item)"
                  size="sm"
                  class="text-xs font-medium select-none rounded-md !w-fit !cursor-text !px-2 grid"
                  :class="[orderGetters.getOrderAgainAvailabilityClass(item)]"
                  :style="{
                    backgroundColor: orderGetters.getOrderAgainAvailabilityBackgroundColor(item),
                    color: orderGetters.getOrderAgainAvailabilityTextColor(item),
                  }"
                >
                  {{ orderGetters.getOrderAgainAvailabilityName(item) }}
                </SfListItem>
                <UiTag
                  v-if="orderGetters.getOrderAgainInformationPrice(item) <= 0"
                  variant="negative"
                  size="sm"
                  class="!font-medium"
                >
                  <SfIconError size="xs" />
                  <span>{{ t('account.ordersAndReturns.orderAgain.notAvailable') }}</span>
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
          <SkeletonsOrderAgainItem class="mt-6" v-for="item in orderGetters.getItems(order)" :key="item.id" />
        </div>

        <div class="mt-4 typography-text-xs flex gap-1">
          <span>{{ t('asterisk') }}</span>
          <span v-if="showNetPrices">{{ t('itemExclVAT') }}</span>
          <span v-else>{{ t('itemInclVAT') }}</span>
          <span>{{ t('excludedShipping') }}</span>
        </div>
      </div>
      <div class="h-auto flex-shrink-0 flex gap-2 ml-auto w-full max-w-[500px] relative justify-end mt-3">
        <SfButton
          data-testid="quick-checkout-cart-button"
          @click="addToCart"
          :disabled="loading || loadingAddToCart"
          size="lg"
          variant="secondary"
        >
          <SfLoaderCircular v-if="loadingAddToCart" class="flex justify-center items-center" size="sm" />
          <span v-else>{{ t('account.ordersAndReturns.orderAgain.addToCart') }}</span>
        </SfButton>

        <SfButton data-testid="quick-checkout-checkout-button" @click="close()" size="lg">
          {{ t('account.ordersAndReturns.orderAgain.cancel') }}
        </SfButton>
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
import { orderGetters } from '@plentymarkets/shop-api';

defineProps<OrderAgainProps>();
const { addModernImageExtension } = useModernImage();
const { isOpen, addOrderToCart, loading } = useOrderAgain();
const { t } = useI18n();
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

const addToCart = async () => {
  loadingAddToCart.value = true;
  if (await addOrderToCart()) {
    goToPage(paths.cart);
  }
  loadingAddToCart.value = false;
};
</script>
