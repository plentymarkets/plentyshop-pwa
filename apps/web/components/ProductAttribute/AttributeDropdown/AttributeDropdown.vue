<template>
  <div>
    <label :for="'attribute-' + attribute.attributeId" class="capitalize text-xs text-neutral-500">
      {{ attribute.name }}
    </label>
    <SfSelect
      :id="'attribute-' + attribute.attributeId"
      size="sm"
      v-model="value"
      @update:model-value="(val) => updateValue(attribute.attributeId, val)"
      :placeholder="$t('pleaseSelect')"
    >
      <option :value="undefined">{{ $t('pleaseSelect') }}</option>
      <option
        v-for="item in attribute.values"
        :key="item.attributeValueId"
        :value="item.attributeValueId"
        :disabled="item.disabled"
      >
        {{ item.name }}
      </option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { AttributeSelectProps } from '../types';

const props = defineProps<AttributeSelectProps>();
const { updateValue, getValue } = useProductAttributes();
const value = ref<number | undefined>(getValue(props.attribute.attributeId));

watch(
  () => getValue(props.attribute.attributeId),
  () => {
    value.value = getValue(props.attribute.attributeId);
  },
);
</script>
