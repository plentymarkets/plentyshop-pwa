<template>
  <div
    v-if="orderItem.typeId !== 6"
    class="relative flex border-b-[1px] border-neutral-200 hover:shadow-lg last:mb-0 p-4 w-full"
    data-testid="cart-product-card"
  >
    <SfLink
      class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px] mr-4"
      :tag="NuxtLink"
      :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')"
    >
      <div class="flex items-center justify-center">
        <NuxtImg
          ref="img"
          :src="
            addModernImageExtension(orderGetters.getOrderVariationImage(order, orderItem)) || '/images/placeholder.png'
          "
          :alt="orderGetters.getItemName(orderItem)"
          class="h-auto border rounded-md border-neutral-200"
          width="300"
          height="300"
          loading="lazy"
        />
        <SfLoaderCircular v-if="!imageLoaded" class="absolute" size="sm" />
      </div>
    </SfLink>
    <div class="flex flex-col min-w-[180px] flex-1">
      <SfLink
        :tag="NuxtLink"
        :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')"
        variant="secondary"
        class="no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ orderGetters.getItemName(orderItem) }}
      </SfLink>
      <div v-if="!orderGetters.isBundleComponents(orderItem)" class="my-2">
        <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="(attribute, index) in orderGetters.getOrderAttributes(orderItem)" :key="index">
            <span v-if="orderGetters.getOrderItemAttributeName(attribute)" class="mr-1">
              {{ orderGetters.getOrderItemAttributeName(attribute) }}:
            </span>
            <span v-if="orderGetters.getOrderItemAttributeValue(attribute)" class="font-medium">
              {{ orderGetters.getOrderItemAttributeValue(attribute) }}
            </span>
          </li>
        </ul>
        <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="(property, index) in orderGetters.getItemOrderProperties(orderItem)" :key="index">
            <span class="mr-1 font-bold">
              <span>{{ orderGetters.getItemOrderPropertyName(property) }}</span>
              <span v-if="orderGetters.getItemOrderPropertyValue(property).length > 0">:</span>
            </span>
            <span v-if="orderGetters.isItemOrderPropertyFile(property)" class="font-medium">
              <a
                :href="orderGetters.getItemOrderPropertyFileUrl(property)"
                target="_blank"
                rel="noopener noreferrer"
                class="underline"
              >
                <span>{{ orderGetters.getItemOrderPropertyValue(property) }}</span>
                <SfIconOpenInNew class="ml-1" size="sm" />
              </a>
            </span>
            <span v-else-if="orderGetters.getItemOrderPropertyValue(property).length > 0" class="font-medium">
              {{ orderGetters.getItemOrderPropertyValue(property) }}
            </span>
          </li>
        </ul>
      </div>
      <div v-if="orderGetters.isBundleComponents(orderItem)" class="my-2 mb-6">
        <ul v-for="(item, index) in orderItem.bundleComponents" :key="index">
          <SfLink
            v-if="productBundleGetters.isItemBundleSalableAndActive(item)"
            :tag="NuxtLink"
            :to="localePath(productBundleGetters.getBundleItemUrl(item))"
            variant="secondary"
            class="no-underline typography-text-sm"
          >
            <p>
              {{ productBundleGetters.getBundleItemQuantity(item) }}x
              <span class="underline px-1 h-">{{ productBundleGetters.getBundleItemName(item) }}</span>
            </p>
          </SfLink>
          <p v-else class="text-sm">
            {{ productBundleGetters.getBundleItemQuantity(item) }}x
            <span class="px-1 h-">{{ productBundleGetters.getBundleItemName(item) }}</span>
          </p>
        </ul>
      </div>
      <div class="items-start sm:items-center sm:mt-auto text-sm">
        <div class="grid grid-cols-2 w-full">
          <p class="font-medium">{{ $t('account.ordersAndReturns.orderDetails.price') }}:</p>
          <p class="text-right">{{ $n(orderGetters.getItemPrice(orderItem), 'currency') }}</p>
        </div>
        <div class="grid grid-cols-2 w-full">
          <p class="font-medium">{{ $t('account.ordersAndReturns.orderDetails.quantity') }}:</p>
          <p class="text-right">{{ orderGetters.getItemQty(orderItem) }}</p>
        </div>
        <div class="grid grid-cols-2 w-full">
          <p class="font-medium">{{ $t('orderConfirmation.total') }}:</p>
          <p class="text-right">
            {{ $n(orderGetters.getItemPrice(orderItem) * orderGetters.getItemQty(orderItem), 'currency') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderGetters, productBundleGetters } from '@plentymarkets/shop-api';
import { SfLink, SfIconOpenInNew, SfLoaderCircular } from '@storefront-ui/vue';
import type { OrderSummaryProductCardProps } from './types';

const { addModernImageExtension } = useModernImage();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const img = ref();
const imageLoaded = ref(false);

const emit = defineEmits(['load']);
defineProps<OrderSummaryProductCardProps>();

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
</script>
