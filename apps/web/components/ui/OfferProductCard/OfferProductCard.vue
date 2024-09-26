<template>
  <div v-for="(variation, variationId, key) in offer.variations" :key="variationId">
    <div class="relative flex border-neutral-200 border-b min-w-[320px] p-4 last:mb-0">
      <div class="overflow-hidden rounded-md w-[100px] sm:w-[176px] mb-2">
        <SfLink :tag="NuxtLink" :to="offer.itemURLs[variationId]" class="flex items-center justify-center">
          <NuxtImg
            ref="img"
            :src="offer.itemImages[variationId] || '/images/placeholder.png'"
            :alt="'name placeholder'"
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
          {{ variation.texts.name1 }}
        </SfLink>
        <p>
          {{ n(filteredOffer.order.orderItems[key]?.amounts[0].priceOriginalGross ?? '', 'currency') }}
        </p>
        <UiBadges v-if="variation" :product="variation" :use-availability="true" :use-tags="false" />

        <p class="flex justify-end self-end text-yellow-600 font-bold text-lg pt-6">
          {{ n(filteredOffer.order.orderItems[key]?.amounts[0].priceOriginalGross ?? '', 'currency') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLink } from '@storefront-ui/vue';
import { OfferProductCardProps } from './types';

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
</script>
