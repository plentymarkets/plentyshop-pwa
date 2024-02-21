<template>
  <div>
    <label :for="'attribute-' + attribute.attributeId" class="leading-5 text-sm text-zinc-900">
      {{ attribute.name }}
    </label>
    <div :id="'attribute-' + attribute.attributeId" class="w-full flex gap-4 flex-wrap">
      <div
        v-for="item in attribute.values"
        :key="item.attributeValueId"
        class="border border-zinc-300 rounded-md cursor-pointer hover:bg-zinc-100"
        :class="{
          'text-zinc-300 border-dashed': item.disabled,
          '!border-primary-700 bg-zinc-100': value === item.attributeValueId,
        }"
        @click="updateValue(attribute.attributeId, item.attributeValueId)"
      >
        <SfTooltip :label="getLabel(item)" strategy="absolute" :show-arrow="true" placement="top">
          <div class="font-medium py-2 px-4">{{ item.name }}</div>
        </SfTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import { AttributeSelectProps } from '../types';
import { VariationMapProductAttributeValue } from '@plentymarkets/shop-api';

const { updateValue, getValue } = useProductAttributes();
const props = defineProps<AttributeSelectProps>();
const value = computed(() => getValue(props.attribute.attributeId));
const { t } = useI18n();

const getLabel = (item: VariationMapProductAttributeValue): string => {
  return item.disabled ? t('productAttributes.seeAvailableOptions') : '';
};
</script>
