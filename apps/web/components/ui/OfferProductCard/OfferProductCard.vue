<template>
  <div v-for="(variation, variationId, key) in props.offer.variations" :key="variationId">
    <div class="relative flex border-neutral-200 border-b min-w-[320px] p-4 last:mb-0">
      <div class="overflow-hidden rounded-md w-[140px] sm:w-[176px] mb-2">
        <SfLink
          :tag="NuxtLink"
          :to="props.offer.itemURLs[variationId.toString()]"
          class="flex items-center justify-center"
        >
          <NuxtImg
            ref="img"
            :src="getImageSource(variationId.toString())"
            :alt="offerGetters.getOfferItemVariationName(variation)"
            width="300"
            height="300"
            loading="lazy"
            class="w-full h-auto border rounded-md border-neutral-200"
          />
        </SfLink>
      </div>
      <div class="pl-2 w-2/3">
        <SfLink
          :tag="NuxtLink"
          :to="offer.itemURLs[variationId]"
          variant="secondary"
          class="w-fit no-underline typography-text-sm sm:typography-text-lg"
        >
          {{ offerGetters.getOfferItemVariationName(variation) }}
        </SfLink>
        <p>{{ formatPrice(offerGetters.getOfferItemOriginalPrice(filteredOffer.order.orderItems[key])) }}</p>
        <UiBadges v-if="variation" :product="variation" :use-availability="true" :use-tags="false" />

        <p class="flex justify-end self-end text-yellow-600 font-bold text-lg pt-6">
          {{ formatPrice(offerGetters.getOfferItemOriginalPriceWithQuantity(filteredOffer.order.orderItems[key])) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLink } from '@storefront-ui/vue';
import type { OfferProductCardProps } from './types';
import { offerGetters } from '@plentymarkets/shop-api';

const props = defineProps<OfferProductCardProps>();
const NuxtLink = resolveComponent('NuxtLink');
const { n } = useI18n();

const filteredOffer = computed(() => {
  const {
    order: { orderItems },
    order,
  } = props.offer;
  const filteredItems = orderItems.filter((item) => item.typeId !== 6);

  return {
    ...props.offer,
    order: { ...order, orderItems: filteredItems },
  };
});

const getImageSource = (variationId: string) => {
  return props.offer.itemImages[variationId] || '/images/placeholder.png';
};

const formatPrice = (price: number) => {
  return n(price, 'currency');
};
</script>
