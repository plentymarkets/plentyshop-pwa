<template>
  <div>
    <label
      :for="'attribute-' + productAttributeGetters.getAttributeId(attribute)"
      class="leading-5 text-sm text-zinc-900"
    >
      {{ productAttributeGetters.getAttributeName(attribute) }}
    </label>
    <div :id="'attribute-' + productAttributeGetters.getAttributeId(attribute)" class="w-full flex gap-4 flex-wrap">
      <div
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        class="border border-zinc-300 rounded-md cursor-pointer hover:bg-[#3C3C4226]"
        :class="{
          'text-zinc-300 border-dashed': productAttributeGetters.isAttributeValueDisabled(item),
          '!border-primary-700 bg-zinc-100': value === productAttributeGetters.getAttributeValueId(item),
        }"
        @click="
          updateValue(
            productAttributeGetters.getAttributeId(attribute),
            productAttributeGetters.getAttributeValueId(item),
          )
        "
      >
        <SfTooltip :label="getLabel(item)" strategy="absolute" :show-arrow="true" placement="top">
          <div class="font-medium h-10 flex items-center px-4">
            {{ productAttributeGetters.getAttributeValueName(item) }}
          </div>
        </SfTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import { AttributeSelectProps } from '../types';
import { VariationMapProductAttributeValue } from '@plentymarkets/shop-api';
import { productAttributeGetters } from '@plentymarkets/shop-sdk';

const { updateValue, getValue } = useProductAttributes();
const props = defineProps<AttributeSelectProps>();
const value = computed(() => getValue(props.attribute.attributeId));
const { t } = useI18n();

const getLabel = (item: VariationMapProductAttributeValue): string => {
  return productAttributeGetters.isAttributeValueDisabled(item) ? t('productAttributes.seeAvailableOptions') : '';
};
</script>
