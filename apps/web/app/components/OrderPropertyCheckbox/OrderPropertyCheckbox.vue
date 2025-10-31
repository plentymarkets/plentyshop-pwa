<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <SfCheckbox
        v-if="!productPropertyGetters.isOrderPropertyHidden(productProperty)"
        :id="`prop-${orderPropertyId}`"
        v-model="value"
        v-bind="valueAttributes"
        :invalid="isOrderPropertyRequired && Boolean(errors['value'])"
        class="mr-2 h-12"
      />
      <div class="flex items-center justify-center">
        <label
          class="cursor-pointer select-none flex items-center justify-center peer-disabled:text-disabled-900"
          :for="`prop-${orderPropertyId}`"
        >
          {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
          <template v-if="orderPropertyLabel.surchargeType">
            ({{ t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
            {{ format(productPropertyGetters.getOrderPropertySurcharge(productProperty)) }})
          </template>
          {{ orderPropertyLabel.surchargeIndicator }}
          <template v-if="orderPropertyLabel.surchargeIndicator && orderPropertyLabel.requiredIndicator"> , </template>
          {{ orderPropertyLabel.requiredIndicator }}
        </label>

        <slot v-if="hasTooltip" name="tooltip" class="w-[28px]" />
      </div>
    </div>

    <ErrorMessage v-if="isOrderPropertyRequired" as="span" name="value" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { OrderPropertyCheckboxProps } from './types';
import { SfCheckbox } from '@storefront-ui/vue';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, boolean } from 'yup';

const props = defineProps<OrderPropertyCheckboxProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const { format } = usePriceFormatter();
const { t } = useI18n();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('properties');
const { getPropertyById } = useProductOrderProperties();
const property = getPropertyById(productProperty.property.id);
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);
const isOrderPropertyRequired = productPropertyGetters.isOrderPropertyRequired(productProperty);

const validationSchema = toTypedSchema(
  object({
    value: boolean().oneOf([true], t('errorMessages.requiredField')),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
  initialValues: { value: productProperty.property.isPreSelected },
});

if (isOrderPropertyRequired) registerValidator(validate);

const [value, valueAttributes] = defineField('value');

if (property?.property) {
  property.property.value = productProperty.property.isPreSelected ? 'true' : null;
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
  () => value.value,
  (updatedValue) => {
    if (property) {
      property.property.value = updatedValue ? 'true' : null;
    }
  },
);
</script>
