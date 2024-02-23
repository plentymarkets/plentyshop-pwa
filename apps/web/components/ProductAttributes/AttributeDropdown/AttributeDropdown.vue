<template>
  <div>
    <label
      :for="'attribute-' + productAttributeGetters.getAttributeId(attribute)"
      class="leading-5 text-sm text-zinc-900"
    >
      {{ productAttributeGetters.getAttributeName(attribute) }}
    </label>
    <SfSelect
      :id="'attribute-' + productAttributeGetters.getAttributeId(attribute)"
      size="sm"
      class="h-10"
      v-model="value"
      @update:model-value="(val) => updateValue(productAttributeGetters.getAttributeId(attribute), val)"
      :placeholder="$t('pleaseSelect')"
    >
      <option :value="undefined">{{ $t('pleaseSelect') }}</option>
      <option
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        :value="productAttributeGetters.getAttributeValueId(item)"
        :disabled="productAttributeGetters.isAttributeValueDisabled(item)"
      >
        {{ productAttributeGetters.getAttributeValueName(item) }}
      </option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { AttributeSelectProps } from '../types';
import { productAttributeGetters } from '@plentymarkets/shop-sdk';

const props = defineProps<AttributeSelectProps>();
const { updateValue, getValue } = useProductAttributes();
const value = ref<string | undefined>(
  getValue(productAttributeGetters.getAttributeId(props.attribute))?.toString() ?? undefined,
);

watch(
  () => getValue(productAttributeGetters.getAttributeId(props.attribute)),
  () => {
    value.value = getValue(productAttributeGetters.getAttributeId(props.attribute))?.toString() ?? undefined;
  },
);
</script>
