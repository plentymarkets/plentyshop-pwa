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

    <div class="flex items-center">
      <SfInput
        :id="`prop-${orderPropertyId}`"
        v-model="value"
        v-bind="valueAttributes"
        :invalid="Boolean(errors['value'])"
        :wrapper-class="'w-full'"
      />

      <div v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </div>
    </div>
    <VeeErrorMessage as="span" name="value" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyInputProps } from './types';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useValidatorAggregatorProperties } from '~/composables/useValidatorAggregator';

const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { t, n } = useI18n();
const { registerValidator, registerInvalidFields } = useValidatorAggregatorProperties();
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const { getPropertyById } = useProductOrderProperties();
const property = getPropertyById(orderPropertyId);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);
const isOrderPropertyRequired = productPropertyGetters.isOrderPropertyRequired(productProperty);

const validationSchema = toTypedSchema(
  object({
    value: string().test({
      test(value, context) {
        if (isOrderPropertyRequired && (value === undefined || value === '')) {
          return context.createError({ message: t('errorMessages.requiredField') });
        }
        if (productPropertyGetters.isOrderPropertyInt(productProperty) && /\D/.test(value as string)) {
          return context.createError({ message: t('errorMessages.numbersOnly') });
        }
        if (productPropertyGetters.isOrderPropertyFloat(productProperty) && /[^\d,.]+/.test(value as string)) {
          return context.createError({ message: t('errorMessages.decimalsOnly') });
        }
        return true;
      },
    }),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

registerValidator(validate);

const [value, valueAttributes] = defineField('value');

watch(
  () => meta.value,
  () => {
    registerInvalidFields(meta.value.valid, `prop-${orderPropertyId}`);
  },
);

watch(
  () => value.value,
  (updatedValue) => {
    if (property) {
      property.property.value = updatedValue === undefined || updatedValue.trim() === '' ? null : updatedValue;
    }
  },
);
</script>
