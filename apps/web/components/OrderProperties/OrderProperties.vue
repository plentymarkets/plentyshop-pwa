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
        <!--Temporary until bug fixed: https://github.com/nuxt/nuxt/issues/23768-->
        <ClientOnly>
          <Component
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
import OrderPropertyCheckbox from '~/components/OrderPropertyCheckbox/OrderPropertyCheckbox.vue';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import { ComponentsMapper } from './types';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const productOrderPropertyGroups = productPropertyGetters.getOrderPropertiesGroups(product);

const componentsMapper: ComponentsMapper = {
  empty: OrderPropertyCheckbox,
};
</script>
