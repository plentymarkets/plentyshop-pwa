<template>
  <div v-for="(group, groupIndex) in orderPropertyGroups" :key="`group-${groupIndex}`">
    <div class="font-semibold">
      {{ productPropertyGetters.getOrderPropertyGroupName(group) }}
    </div>

    <div class="font-normal typography-text-sm">
      {{ productPropertyGetters.getOrderPropertyGroupDescription(group) }}
    </div>

    <div v-for="(productProperty, propIndex) in group.orderProperties" :key="`group-prop-${propIndex}`">
      <div v-if="!productPropertyGetters.isOrderPropertyHidden(productProperty)" class="mt-4 w-full">
        <!-- ClientOnly until fixed: https://github.com/nuxt/nuxt/issues/23768#issuecomment-1849023053 -->
        <ClientOnly>
          <Component
            v-if="productPropertyGetters.hasResolvedOrderPropertyComponent(productProperty)"
            :has-tooltip="hasOrderPropertiesTooltips"
            :product-property="productProperty"
            :is="componentsMapper[productPropertyGetters.getOrderPropertyValueType(productProperty)]"
          >
            <template v-if="productPropertyGetters.hasOrderPropertyDescription(productProperty)" #tooltip>
              <SfTooltip
                :label="productPropertyGetters.getOrderPropertyDescription(productProperty)"
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
import { ComponentsMapper, OrderPropertiesProps } from '~/components/OrderProperties/types';
import OrderPropertyInput from '~/components/OrderPropertyInput/OrderPropertyInput.vue';
import OrderPropertyCheckbox from '~/components/OrderPropertyCheckbox/OrderPropertyCheckbox.vue';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const props = defineProps<OrderPropertiesProps>();
const product = props.product;
const orderPropertyGroups = productPropertyGetters.getOrderPropertiesGroups(product);
const hasOrderPropertiesTooltips = productPropertyGetters.hasOrderPropertiesGroupsTooltips(orderPropertyGroups);

const componentsMapper: ComponentsMapper = {
  empty: OrderPropertyCheckbox,
  int: OrderPropertyInput,
  text: OrderPropertyInput,
  float: OrderPropertyInput,
};
</script>
