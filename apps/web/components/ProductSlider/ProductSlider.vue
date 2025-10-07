<template>
  <SfScrollable
    buttons-placement="floating"
    class="pb-4 scrollbar-hidden"
    :wrapper-class="wrapperClass"
    data-testid="product-slider"
  >
    <UiProductCard
      v-for="product in items"
      :key="productGetters.getId(product)"
      :product="product"
      is-from-slider
      class="max-w-48"
    />
  </SfScrollable>
  <div class="mt-4 typography-text-xs flex gap-1">
    <span>{{ t('asterisk') }}</span>
    <span v-if="showNetPrices">{{ t('itemExclVAT') }}</span>
    <span v-else>{{ t('itemInclVAT') }}</span>
    <i18n-t keypath="excludedShipping" scope="global">
      <template #shipping>
        <SfLink
          :href="localePath(paths.shipping)"
          target="_blank"
          class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
        >
          {{ t('delivery') }}
        </SfLink>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable, SfLink } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';
import { paths } from '~/utils/paths';

const { showNetPrices } = useCart();
const localePath = useLocalePath();
const { t } = useI18n();

defineProps<ProductSliderProps>();
</script>
