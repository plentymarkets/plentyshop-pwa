<template>
  <div data-testid="shipping-method" class="md:px-4 my-6">
    <div class="flex justify-between items-center">
      <h3 class="text-neutral-900 text-lg font-bold">{{ $t('shippingMethod.heading') }}</h3>
    </div>
    <div class="mt-4">
      <ul v-if="shippingMethods" class="grid gap-y-4 md:grid-cols-2 md:gap-x-4" role="radiogroup">
        <SfListItem
          v-for="method in shippingMethods"
          as="label"
          :key="shippingProviderGetters.getParcelServicePresetId(method)"
          class="border rounded-md items-start"
          @click="radioModel = shippingProviderGetters.getParcelServicePresetId(method)"
        >
          <div class="flex gap-2">
            <SfRadio
              v-model="radioModel"
              :checked="
                shippingProviderGetters.getShippingProfileId(cart).toString() ===
                shippingProviderGetters.getParcelServicePresetId(method)
              "
              :value="shippingProviderGetters.getParcelServicePresetId(method)"
            />
            <div>
              <p>{{ shippingProviderGetters.getShippingMethodName(method) }}</p>
              <p class="text-xs text-neutral-500">estimatedDelivery - TODO</p>
            </div>
            <p class="ml-auto">${{ shippingProviderGetters.getShippingAmount(method) }}</p>
          </div>
        </SfListItem>
      </ul>

      <div v-else class="flex mb-6">
        <SfIconBlock class="mr-2 text-neutral-500" />
        <p>{{ $t('shippingMethod.description') }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { SfIconBlock, SfListItem, SfRadio } from '@storefront-ui/vue';
import type { ShippingMethodProps } from '~/components/ShippingMethod/types';
import { shippingProviderGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';

defineProps<ShippingMethodProps>();

const { data: cart } = useCart();
const radioModel = ref(cart.value?.shippingProviderId.toString());
</script>
