<template>
  <div class="relative flex border-neutral-200 border-b p-4">
    <div class="relative overflow-hidden flex-shrink-0 rounded-md w-24 h-24 sm:h-40 sm:w-40">
      <NuxtImg
        ref="img"
        :src="
          addModernImageExtension(orderGetters.getOrderVariationImage(order, item)) ||
          '/_nuxt-plenty/images/placeholder.png'
        "
        :alt="orderGetters.getItemName(item)"
        width="300"
        height="300"
        loading="lazy"
        class="w-full h-full object-contain border rounded-md border-neutral-200"
      />
    </div>

    <div class="ml-3 w-full flex flex-col">
      <h1 class="w-fit no-underline typography-text-sm sm:typography-text-lg break-word" data-testid="product-name">
        {{ orderGetters.getItemQty(item) }}x {{ orderGetters.getItemName(item) }}
      </h1>
      <Price
        v-if="orderGetters.isItemSalableAndActive(order, item) && orderGetters.hasAllOrderPropertiesAvailable(item)"
        :price="roundAmount(orderGetters.getOrderAgainInformationPrice(item))"
        :crossed-price="itemPrice"
      />
      <div
        v-if="orderGetters.getItemShortDescription(order, item)"
        class="mb-2 font-normal typography-text-sm whitespace-pre-wrap break-words text-center sm:text-left"
        data-testid="product-description"
      >
        {{ orderGetters.getItemShortDescription(order, item) }}
      </div>
      <div v-if="!orderGetters.isBundleComponents(item)" class="mb-2">
        <ul class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700">
          <li v-for="(attribute, index) in orderGetters.getOrderAttributes(item)" :key="index">
            <span v-if="orderGetters.getOrderItemAttributeName(attribute)" class="mr-1">
              {{ orderGetters.getOrderItemAttributeName(attribute) }}:
            </span>
            <span v-if="orderGetters.getOrderItemAttributeValue(attribute)" class="font-medium">
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
                  productPropertyGetters.getOrderPropertyLabel(orderGetters.getOrderAgainOrderProperty(item, property)!)
                    .surchargeType
                "
              >
                ({{
                  t(
                    'orderProperties.vat.' +
                      productPropertyGetters.getOrderPropertyLabel(
                        orderGetters.getOrderAgainOrderProperty(item, property)!,
                      ).surchargeType,
                  )
                }}
                {{
                  format(
                    productPropertyGetters.getOrderPropertySurcharge(
                      orderGetters.getOrderAgainOrderProperty(item, property)!,
                    ),
                  )
                }})</span
              >
              <span v-if="orderGetters.getItemOrderPropertyValue(property).length > 0">:</span>
            </span>
            <span v-if="orderGetters.getItemOrderPropertyValue(property).length > 0" class="font-medium">
              {{ orderGetters.getItemOrderPropertyValue(property) }}
            </span>
          </li>
        </ul>
      </div>
      <div class="w-full flex flex-wrap gap-2">
        <SfListItem
          v-if="orderGetters.getOrderAgainAvailability(item) && orderGetters.getOrderAgainAvailabilityName(item)"
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
          v-if="
            !orderGetters.isItemSalableAndActive(order, item) || orderGetters.getOrderAgainOrderItemStock(item) === 0
          "
          variant="negative"
          size="sm"
          class="!font-medium"
        >
          <SfIconError size="xs" />
          <span>{{ t('account.ordersAndReturns.orderAgain.notAvailable') }}</span>
        </UiTag>
        <UiTag
          v-else-if="orderGetters.getOrderAgainOrderItemStock(item) < orderGetters.getItemQty(item)"
          variant="negative"
          size="sm"
          class="!font-medium"
        >
          <SfIconError size="xs" />
          <span>{{
            t('account.ordersAndReturns.orderAgain.stockLimitation', {
              stock: orderGetters.getOrderAgainOrderItemStock(item),
            })
          }}</span>
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
          v-else-if="itemPrice && roundAmount(orderGetters.getOrderAgainInformationPrice(item)) > itemPrice"
          variant="secondary"
          size="sm"
          class="!font-medium"
        >
          <SfIconArrowUpward size="xs" />
          <span>{{ t('account.ordersAndReturns.orderAgain.priceUp') }}</span>
        </UiTag>
        <UiTag
          v-else-if="itemPrice && roundAmount(orderGetters.getOrderAgainInformationPrice(item)) < itemPrice"
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
</template>

<script setup lang="ts">
import { SfIconArrowDownward, SfIconArrowUpward, SfIconError, SfListItem } from '@storefront-ui/vue';
import type { OrderAgainItemProps } from './types';
import { cartGetters, orderGetters, productPropertyGetters } from '@plentymarkets/shop-api';

const props = defineProps<OrderAgainItemProps>();

const { addModernImageExtension } = useModernImage();
const { data: cart } = useCart();
const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
const { t } = useI18n();
const { format } = usePriceFormatter();
const { showNetPrices } = useCart();

const roundAmount = (value: number) => {
  return Math.round(value * 100) / 100;
};
const itemPrice = ref<number | null>(null);
const amount = showNetPrices.value
  ? orderGetters.getItemNetPriceByCurrency(props.item, currency.value)
  : orderGetters.getItemPriceByCurrency(props.item, currency.value);

itemPrice.value = amount ? roundAmount(amount) : null;
</script>
