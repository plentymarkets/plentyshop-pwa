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
      v-model="value"
      size="lg"
      :placeholder="t('form.selectPlaceholder')"
      :invalid="Boolean(errors['selectedValue'])"
      @update:model-value="(event) => doUpdateValue(Number(event))"
    >
      <option :value="-1">{{ t('form.selectPlaceholder') }}</option>
      <option
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        :value="productAttributeGetters.getAttributeValueId(item)"
        :disabled="productAttributeGetters.isAttributeValueDisabled(item)"
      >
        {{ productAttributeGetters.getAttributeValueName(item) }}
      </option>
    </SfSelect>
    <ErrorMessage as="span" name="selectedValue" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import type { AttributeSelectProps } from '../types';
import { productAttributeGetters } from '@plentymarkets/shop-api';
import { number, object } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';

const { attribute } = defineProps<AttributeSelectProps>();
const { updateValue, getValue } = useProductAttributes();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const value = ref<string | undefined>(
  getValue(productAttributeGetters.getAttributeId(attribute))?.toString() ?? undefined,
);

watch(
  () => getValue(productAttributeGetters.getAttributeId(attribute)),
  () => {
    value.value = getValue(productAttributeGetters.getAttributeId(attribute))?.toString() ?? '-1';
  },
);

const validationSchema = toTypedSchema(
  object({
    selectedValue: number().required(t('error.requiredField')),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

registerValidator(validate);

const [selectedValue] = defineField('selectedValue');

const doUpdateValue = (value: number) => {
  if (value > -1) {
    updateValue(attribute.attributeId, value);
    selectedValue.value = getValue(attribute.attributeId);
  }
};

const setValue = (value: string | undefined) => {
  selectedValue.value = value ? Number(value) : undefined;
};

setValue(value.value);

watch(
  () => value.value,
  () => {
    setValue(value.value);
  },
);

watch(
  () => meta.value,
  () => {
    registerInvalidFields(
      meta.value.valid,
      `prop-${productAttributeGetters.getAttributeId(attribute)}`,
      productAttributeGetters.getAttributeName(attribute),
    );
  },
);
</script>
