<template>
  <div v-for="(group, groupIndex) in productOrderPropertyGroups" :key="`group-${groupIndex}`">
    <div class="font-semibold">
      {{ productPropertyGetters.getOrderPropertyGroupName(group) }}
    </div>

    <div class="font-normal typography-text-sm">
      {{ productPropertyGetters.getOrderPropertyGroupDescription(group) }}
    </div>

    <div v-for="(productProperty, propIndex) in group.orderProperties" :key="`group-prop-${propIndex}`">
      <div v-if="!productPropertyGetters.isHidden(productProperty.property)" class="mt-4 flex items-center">
        <!-- ClientOnly until fixed: https://github.com/nuxt/nuxt/issues/23768#issuecomment-1849023053 -->
        <ClientOnly>
          <Component
            :class="[productPropertyGetters.hasOrderPropertiesGroupTooltips(group) ? '' : '']"
            :product-property="productProperty.property"
            :is="componentsMapper[productProperty.property.valueType]"
          >
            <template v-if="productPropertyGetters.hasOrderPropertyDescription(productProperty.property)">
              <SfTooltip
                :label="productPropertyGetters.getOrderPropertyDescription(productProperty.property)"
                :placement="'bottom'"
                :show-arrow="true"
                class="ml-2"
              >
                <SfIconInfo :size="'sm'" />
              </SfTooltip>
            </template>
          </Component>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertiesProps } from '~/components/OrderProperties/types';
import OrderPropertyInput from '~/components/OrderPropertyInput/OrderPropertyInput.vue';
import OrderPropertyCheckbox from '~/components/OrderPropertyCheckbox/OrderPropertyCheckbox.vue';
import { ComponentsMapper } from './types';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

// v-if="productPropertyGetters.isOrderPropertyInput(productProperty.property)"

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const productOrderPropertyGroups = productPropertyGetters.getOrderPropertiesGroups(product);

const componentsMapper: ComponentsMapper = {
  empty: OrderPropertyCheckbox,
};
</script>
