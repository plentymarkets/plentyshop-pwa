<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg last:mb-0 p-4 w-full"
    data-testid="cart-product-card"
    v-if="orderItem.typeId !== 6"
  >
    <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px] mr-4">
      <SfLink :tag="NuxtLink" :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')">
        <NuxtImg
          class="h-auto border rounded-md border-neutral-200"
          :src="addWebpExtension(orderGetters.getOrderVariationImage(order, orderItem)) || '/images/placeholder.png'"
          :alt="'' || ''"
          width="300"
          height="300"
          loading="lazy"
          format="webp"
        />
      </SfLink>
    </div>
    <div class="flex flex-col min-w-[180px] flex-1">
      <SfLink
        :tag="NuxtLink"
        :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')"
        variant="secondary"
        class="no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ orderGetters.getItemName(orderItem) }}
      </SfLink>
      <div class="my-2">
        <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="(attribute, index) in orderGetters.getOrderAttributes(orderItem)" :key="index">
            <span class="mr-1 font-bold" v-if="orderGetters.getOrderItemAttributeName(attribute)">
              {{ orderGetters.getOrderItemAttributeName(attribute) }}:
            </span>
            <span class="font-medium" v-if="orderGetters.getOrderItemAttributeValue(attribute)">
              {{ orderGetters.getOrderItemAttributeValue(attribute) }}
            </span>
          </li>
        </ul>
        <ul class="text-xs leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="(property, index) in orderGetters.getItemOrderProperties(orderItem)" :key="index">
            <span class="mr-1">
              <span class="font-bold">{{ orderGetters.getItemOrderPropertyName(property) }}</span>
              <span v-if="orderGetters.getItemOrderPropertyValue(property).length > 0">:</span>
            </span>
            <span v-if="orderGetters.isItemOrderPropertyFile(property)">
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
            <span v-else-if="orderGetters.getItemOrderPropertyValue(property).length > 0">
              {{ orderGetters.getItemOrderPropertyValue(property) }}
            </span>
          </li>
          <li>
            <span class="font-bold mr-2">{{ $t('account.ordersAndReturns.orderDetails.price') }}:</span>
            <span>{{ $n(orderGetters.getItemPrice(orderItem), 'currency') }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="mx-5 flex flex-col">
      <div class="flex-1"></div>
      <div>
        <UiQuantitySelector
          @change-quantity="debounceQuantity"
          :value="orderGetters.getItemQty(orderItem)"
          :min-value="1"
          class="mt-4 sm:mt-0"
        />
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex-1"></div>
      <label>
        <span class="pb-1 text-sm font-medium text-neutral-900"> Return reason </span>
        <SfSelect v-model="returnReason" size="sm" placeholder="Select Return Reason">
          <option v-for="{ value, label } in options" :key="value" :value="value">
            {{ label }}
          </option>
        </SfSelect>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfLink, SfIconOpenInNew, SfSelect } from '@storefront-ui/vue';
import type { OrderSummaryProductCardProps } from './types';
import { debounce } from 'lodash';
const { addWebpExtension } = useImageUrl();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const changeQuantity = async () => {};

const options = ref([
  { label: 'Item damaged', value: 'Item damaged' },
  { label: 'No reason', value: 'No reason' },
]);
const returnReason = ref('');
const debounceQuantity = debounce(changeQuantity, 500);
defineProps<OrderSummaryProductCardProps>();
</script>
