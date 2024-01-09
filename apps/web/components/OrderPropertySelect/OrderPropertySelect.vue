<template>
  <div class="w-full">
    <label :for="`prop-${orderPropertyId}`">
      {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
      <template v-if="orderPropertyLabel.surchargeType">
        ({{ t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
        {{ n(productPropertyGetters.getOrderPropertySurcharge(productProperty), 'currency') }})
      </template>
      {{ orderPropertyLabel.surchargeIndicator }}
      <template v-if="orderPropertyLabel.surchargeIndicator && orderPropertyLabel.requiredIndicator"> , </template>
      {{ orderPropertyLabel.requiredIndicator }}
    </label>

    <div class="flex items-center w-full">
      <div class="w-full">
        <SfSelect
          :id="`prop-${orderPropertyId}`"
          v-model="selectedValue"
          v-bind="selectedValueAttributes"
          :invalid="Boolean(errors['selectedValue'])"
          :placeholder="`-- ${t('orderProperties.select')} --`"
        >
          <option value="">{{ t('orderProperties.noSelection') }}</option>
          <option v-for="{ value, label } in options" :key="value" :value="value">
            {{ label }}
          </option>
        </SfSelect>
      </div>

      <div v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </div>
    </div>
    <VeeErrorMessage as="span" name="selectedValue" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script lang="ts" setup>
import { SfSelect } from '@storefront-ui/vue';
import { OrderPropertySelectProps } from './types';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import type { OrderPropertySelectionValue } from '@plentymarkets/shop-api';
import { object, string } from 'yup';
import { useForm } from 'vee-validate';
import { useValidatorAggregatorProperties } from '~/composables/useValidatorAggregator';

const props = defineProps<OrderPropertySelectProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { t, n } = useI18n();
const { invalidFields, registerValidator } = useValidatorAggregatorProperties();
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const { getPropertyById } = useProductOrderProperties();
const property = getPropertyById(orderPropertyId);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);

const options = Object.values(productProperty.property.selectionValues).map(
  (selection: OrderPropertySelectionValue) => ({
    label: selection.name,
    value: String(selection.id),
  }),
);

const validationSchema = toTypedSchema(
  object({
    selectedValue: string().required(t('errorMessages.requiredField')).default(''),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

// const addValidator = inject(AddValidatorKey, () => {
//   throw new Error(t('errorMessages.missingValidationAggregator'));
// });

registerValidator(validate);

watch(
  () => meta.value,
  () => {
    meta.value.valid
      ? invalidFields.value.splice(invalidFields.value.findIndex((field) => field['selectedValue']))
      : invalidFields.value.push({ selectedValue: true });
  },
);

const [selectedValue, selectedValueAttributes] = defineField('selectedValue');

if (productPropertyGetters.isOrderPropertyPreSelected(productProperty) && Object.values(options).length > 0) {
  selectedValue.value = String(Object.values(options)[0].value);
}

watch(
  () => selectedValue.value,
  (updatedValue) => {
    if (property) {
      property.property.value = updatedValue === undefined || updatedValue.trim() === '' ? null : updatedValue;
    }
  },
  { immediate: true },
);
</script>
