<template>
  <div class="w-full">
    <label :for="`prop-${orderPropertyId}`" class="leading-5 text-sm text-zinc-900">
      {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
      <template v-if="orderPropertyLabel.surchargeType">
        ({{ t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
        {{ format(productPropertyGetters.getOrderPropertySurcharge(productProperty)) }})
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
          class="h-12"
          :invalid="isOrderPropertyRequired && Boolean(errors['selectedValue'])"
          :placeholder="`-- ${t('orderProperties.select')} --`"
        >
          <option value="">{{ t('orderProperties.noSelection') }}</option>
          <option v-for="{ value, label } in options" :key="value" :value="value">
            {{ label }}
          </option>
        </SfSelect>
      </div>

      <slot v-if="hasTooltip" name="tooltip" class="w-[28px]" />
    </div>

    <ErrorMessage
      v-if="isOrderPropertyRequired"
      as="span"
      name="selectedValue"
      class="flex text-negative-700 text-sm mt-2"
    />
  </div>
</template>

<script lang="ts" setup>
import { SfSelect } from '@storefront-ui/vue';
import type { OrderPropertySelectProps } from './types';
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { OrderPropertySelectionValue } from '@plentymarkets/shop-api';
import { object, string } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';

const props = defineProps<OrderPropertySelectProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { format } = usePriceFormatter();
const { t } = useI18n();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('properties');
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const { getPropertyById } = useProductOrderProperties();
const property = getPropertyById(orderPropertyId);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);
const isOrderPropertyRequired = productPropertyGetters.isOrderPropertyRequired(productProperty);

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

if (isOrderPropertyRequired) registerValidator(validate);

const [selectedValue, selectedValueAttributes] = defineField('selectedValue');

if (productPropertyGetters.isOrderPropertyPreSelected(productProperty) && Object.values(options).length > 0) {
  selectedValue.value = String(Object.values(options)?.[0]?.value || '');
}

watch(
  () => meta.value,
  () => {
    if (isOrderPropertyRequired) {
      registerInvalidFields(
        meta.value.valid,
        `prop-${orderPropertyId}`,
        productPropertyGetters.getOrderPropertyName(productProperty),
      );
    }
  },
);

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
