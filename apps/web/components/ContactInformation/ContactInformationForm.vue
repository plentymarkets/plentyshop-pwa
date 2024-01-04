<template>
  <form @submit.prevent="onSubmit" data-testid="contact-information-form" novalidate>
    <label>
      <UiFormLabel>{{ t('contactInfo.email') }}</UiFormLabel>
      <SfInput
        v-model="customerEmail"
        v-bind="customerEmailAttributes"
        :invalid="Boolean(errors['cart.customerEmail'])"
        name="customerEmail"
        type="email"
        autocomplete="email"
      />
      <VeeErrorMessage as="span" name="cart.customerEmail" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
      <SfButton @click="resetForm()" type="reset" class="md:mr-4" variant="secondary">
        {{ t('contactInfo.clear') }}
      </SfButton>

      <SfButton
        type="submit"
        data-testid="contact-information-save-button"
        class="min-w-[120px] mb-4 md:mb-0"
        :disabled="loading || !meta.valid"
      >
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <template v-else>{{ t('contactInfo.save') }}</template>
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';

const emit = defineEmits(['on-save']);
const { t } = useI18n();
const { loading } = useCustomer();

const validationSchema = toTypedSchema(
  object({
    cart: object({
      customerEmail: string()
        .email(t('errorMessages.email.valid'))
        .required(t('errorMessages.email.required'))
        .default(''),
    }),
  }),
);

const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: validationSchema,
});

const onSubmit = handleSubmit((values) => emit('on-save', values.cart.customerEmail));
const [customerEmail, customerEmailAttributes] = defineField('cart.customerEmail');
</script>
