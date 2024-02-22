<template>
  <div
    class="flex flex-col sm:flex-none border-t-[1px] border-neutral-200 hover:shadow-lg last:mb-0 px-2 py-4"
    data-testid="cart-product-card"
    v-if="displayItem"
  >
    <div class="md:flex flex-none p-2 w-full">
      <div class="flex md:flex-none w-full md:w-2/3">
        <div class="rounded-md w-[180px] sm:w-[176px]">
          <SfLink :tag="NuxtLink" :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')">
            <NuxtImg
              class="h-auto border rounded-md border-neutral-200"
              :src="
                addWebpExtension(orderGetters.getOrderVariationImage(order, orderItem)) || '/images/placeholder.png'
              "
              width="300"
              height="300"
              loading="lazy"
              format="webp"
            />
          </SfLink>
          <UiQuantitySelector
            :key="quantity"
            @change-quantity="debounceQuantity"
            :value="quantity"
            :min-value="0"
            :max-value="orderGetters.getItemReturnableQty(orderItem)"
            class="mt-4 w-full"
          />
        </div>
        <div class="flex self-start flex-col mx-4">
          <SfLink
            :tag="NuxtLink"
            :to="localePath(orderGetters.getOrderVariationPath(order, orderItem) ?? '/#')"
            variant="secondary"
            class="no-underline typography-text-sm sm:typography-text-lg"
          >
            {{ orderGetters.getItemName(orderItem) }}
          </SfLink>
          <div class="mt-2 md:mb-2">
            <!-- <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
              <li v-for="(attribute, index) in orderGetters.getOrderAttributes(orderItem)" :key="index">
                <span class="mr-1 font-bold" v-if="orderGetters.getOrderItemAttributeName(attribute)">
                  {{ orderGetters.getOrderItemAttributeName(attribute) }}:
                </span>
                <span class="font-medium" v-if="orderGetters.getOrderItemAttributeValue(attribute)">
                  {{ orderGetters.getOrderItemAttributeValue(attribute) }}
                </span>
              </li>
            </ul> -->
            <ul class="text-xs leading-5 sm:typography-text-sm text-neutral-700">
              <!-- <li v-for="(property, index) in orderGetters.getItemOrderProperties(orderItem)" :key="index">
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
              </li> -->
              <li>
                <span class="font-bold mr-2">{{ $t('account.ordersAndReturns.orderDetails.price') }}:</span>
                <span>{{ $n(orderGetters.getItemPrice(orderItem), 'currency') }}</span>
              </li>
              <li>
                <span class="font-bold mr-2">{{ $t('returns.quantity') }}:</span>
                <span>{{ orderGetters.getItemQty(orderItem) }}</span>
              </li>
              <li>
                <span class="font-bold mr-2">{{ $t('orderConfirmation.total') }}:</span>
                <span>
                  {{ $n(orderGetters.getItemPrice(orderItem) * orderGetters.getItemQty(orderItem), 'currency') }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="py-2 w-full md:flex md:flex-col md:mt-2">
        <div class="w-full md:self-end">
          <label>
            <span class="pb-1 text-sm font-medium text-neutral-900"> {{ $t('returns.returnReason') }} </span>
            <SfSelect
              @update:model-value="changeReason($event)"
              :model-value="String(returnReasonId)"
              size="sm"
              class="h-fit"
              :placeholder="$t(`returns.selectReturnReason`)"
            >
              <option :value="null">— {{ $t('returns.selectReturnReason') }} —</option>
              <option v-for="{ id, name } in returnReasons.reasons" :key="id" :value="id">
                {{ name }}
              </option>
            </SfSelect>
          </label>
        </div>

        <div class="my-2 w-full md:self-end">
          <button
            class="flex bg-gray-100 border border-gray-200 p-1 pl-4 w-full justify-between items-center"
            :class="opened ? 'rounded-t-md' : 'rounded-md'"
            @click="toggleDropdown"
          >
            Show Details
            <SfIconChevronLeft
              class="text-neutral-500 mr-2.5"
              :class="{ 'rotate-90': opened, '-rotate-90': !opened }"
            />
          </button>
          <div v-if="opened" class="dropdown">
            <div v-for="(attribute, index) in orderGetters.getOrderAttributes(orderItem)" :key="index">
              <h3
                class="h-full w-full border border-gray-200 p-1.5"
                :class="
                  index === orderGetters.getOrderAttributes(orderItem).length - 1 &&
                  orderGetters.getItemOrderProperties(orderItem).length === 0
                    ? 'rounded-b-md'
                    : ''
                "
              >
                <div class="flex justify-between">
                  <p class="text-sm px-2">{{ orderGetters.getOrderItemAttributeName(attribute) }}</p>
                  <p class="text-sm px-2 text-gray-300">{{ orderGetters.getOrderItemAttributeValue(attribute) }}</p>
                </div>
              </h3>
            </div>
            <div v-for="(property, index) in orderGetters.getItemOrderProperties(orderItem)" :key="index">
              <h3
                class="h-full w-full border border-gray-200 p-1.5"
                :class="index === orderGetters.getItemOrderProperties(orderItem).length - 1 ? 'rounded-b-md' : ''"
              >
                <div class="flex justify-between">
                  <p class="text-sm px-2">{{ orderGetters.getItemOrderPropertyName(property) }}</p>
                  <p class="text-sm px-2 text-gray-300">{{ orderGetters.getItemOrderPropertyValue(property) }}</p>
                </div>
              </h3>
            </div>
            <h3
              v-if="orderGetters.getOrderAttributes(props.orderItem).length === 0"
              class="h-full text-center w-full border border-gray-200 p-1 rounded-b-md"
            >
              None
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfLink, SfSelect, SfIconChevronLeft } from '@storefront-ui/vue';
import type { OrderSummaryProductCardProps } from './types';
import _ from 'lodash';

const { addWebpExtension } = useImageUrl();
const { updateQuantity, updateReason, returnData } = useReturnOrder();
const { returnReasons } = useCustomerReturns();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const props = defineProps<OrderSummaryProductCardProps>();
const opened = ref(false);

const toggleDropdown = () => {
  opened.value = !opened.value;
};

const changeQuantity = async (quantity: number) => {
  updateQuantity(props.orderItem.itemVariationId, quantity);
};
const changeReason = async (reasonId: number | null) => {
  updateReason(props.orderItem.itemVariationId, reasonId);
};

const quantity = computed(() => returnData.value?.['variationIds']?.[props.orderItem.itemVariationId]?.quantity || 0);
const returnReasonId = computed(
  () => returnData.value?.['variationIds']?.[props.orderItem.itemVariationId]?.returnReasonId || '',
);

const displayItem = computed(
  () => props.orderItem.typeId !== 6 && orderGetters.getItemReturnableQty(props.orderItem) > 0,
);
const debounceQuantity = _.debounce(changeQuantity, 500);
</script>
