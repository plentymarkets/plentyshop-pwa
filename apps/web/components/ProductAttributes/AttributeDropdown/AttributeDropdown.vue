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
      :placeholder="t('pleaseSelect')"
      :invalid="Boolean(errors['selectedValue'])"
      @update:model-value="(event) => doUpdateValue(Number(event))"
    >
      <option :value="undefined">{{ t('pleaseSelect') }}</option>
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

const { t } = useI18n();
const { attribute } = defineProps<AttributeSelectProps>();
const { updateValue, getValue } = useProductAttributes();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const value = ref<string | undefined>(
  getValue(productAttributeGetters.getAttributeId(attribute))?.toString() ?? undefined,
);

watch(
  () => getValue(productAttributeGetters.getAttributeId(attribute)),
  () => {
    value.value = getValue(productAttributeGetters.getAttributeId(attribute))?.toString() ?? undefined;
  },
);

const validationSchema = toTypedSchema(
  object({
    selectedValue: number().required(t('errorMessages.requiredField')),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

registerValidator(validate);

const [selectedValue] = defineField('selectedValue');

const doUpdateValue = (value: number) => {
  updateValue(attribute.attributeId, value);
  selectedValue.value = getValue(attribute.attributeId);
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
