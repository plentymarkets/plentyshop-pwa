<template>
  <div class="flex flex-col gap-y-6 font-body">
    <label>
      <div class="pb-1 text-sm font-medium text-neutral-900">
        {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
        <span v-if="productPropertyGetters.isOrderPropertyRequired(productProperty)"> * </span>
        <span v-if="hasTooltip" class="w-[28px]">
          <slot name="tooltip" />
        </span>
      </div>
      <SfSelect v-model="selectedProperty" size="sm" placeholder="-- Select --">
        <option v-for="{ value, label } in options" :key="value" :value="value">
          {{ label }}
        </option>
      </SfSelect>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { SfSelect } from '@storefront-ui/vue';
import { OrderPropertySelectProps } from './types';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import type { OrderPropertySelectionValue } from '@plentymarkets/shop-api';
import { Ref, ref } from 'vue';
const props = defineProps<OrderPropertySelectProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const selectedProperty: Ref<string> = ref('');

const options = Object.values(productProperty.property.selectionValues).map(
  (selection: OrderPropertySelectionValue) => ({
    label: selection.name,
    value: String(selection.id),
  }),
);
if (productPropertyGetters.isOrderPropertyPreSelected(productProperty) && Object.values(options).length > 0) {
  selectedProperty.value = String(Object.values(options)[0].value);
}
</script>
