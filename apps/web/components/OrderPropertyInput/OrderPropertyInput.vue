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

    <div class="flex items-center">
      <textarea
        v-if="isMultiline"
        :id="`prop-${orderPropertyId}`"
        v-model="value"
        v-bind="valueAttributes"
        class="bg-white outline-none rounded-md ring-1 ring-neutral-200 text-neutral-500 hover:ring-primary-500 focus:ring-primary-500 active:ring-2 focus:ring-2 h-[80px] w-full p-2"
        :class="{ '!ring-negative-700 ring-2': isOrderPropertyRequired && Boolean(errors['value']) }"
      />
      <SfInput
        v-else
        :id="`prop-${orderPropertyId}`"
        v-model="value"
        v-bind="valueAttributes"
        :invalid="Boolean(errors['value'])"
        size="lg"
        :wrapper-class="'w-full'"
      />

      <slot v-if="hasTooltip" name="tooltip" class="w-[28px]" />
    </div>
    <ErrorMessage as="span" name="value" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { OrderPropertyInputProps } from './types';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

const props = defineProps<OrderPropertyInputProps>();
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
const isMultiline = productPropertyGetters.isMultiline(productProperty);

const validationSchema = toTypedSchema(
  object({
    value: string().test((value, context) => {
      if (isOrderPropertyRequired && !value) {
        return context.createError({ message: t('errorMessages.requiredField') });
      }

      if (value && value.length > 128) {
        return context.createError({ message: t('errorMessages.maxCharacters', { max: 128 }) });
      }

      const isInt = productPropertyGetters.isOrderPropertyInt(productProperty);
      const isFloat = productPropertyGetters.isOrderPropertyFloat(productProperty);

      if (value && isInt && /\D/.test(value)) {
        return context.createError({ message: t('errorMessages.wholeNumber') });
      }

      if (value && isFloat && !/^\d+(?:[,.]\d*)?$/.test(value)) {
        return context.createError({ message: t('errorMessages.decimalNumber') });
      }

      return true;
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
    registerInvalidFields(
      meta.value.valid,
      `prop-${orderPropertyId}`,
      productPropertyGetters.getOrderPropertyName(productProperty),
    );
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
