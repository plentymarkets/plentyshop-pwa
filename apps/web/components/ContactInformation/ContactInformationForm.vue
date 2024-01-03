<template>
  <form data-testid="contact-information-form" @submit.prevent="onSubmit" novalidate>
    <label>
      <UiFormLabel>{{ t('contactInfo.email') }}</UiFormLabel>
      <SfInput
        v-model="customerEmail"
        v-bind="emailAttributes"
        :invalid="Boolean(errors['cart.customerEmail'])"
        name="customerEmail"
        type="email"
        autocomplete="email"
      />
      <ErrorMessage v-if="errors['cart.customerEmail']" :message="errors['cart.customerEmail']" />
    </label>

    <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
      <SfButton type="reset" class="md:mr-4" variant="secondary" @click="resetForm()">
        {{ t('contactInfo.clear') }}
      </SfButton>

      <SfButton
        data-testid="contact-information-save-button"
        type="submit"
        class="min-w-[120px] mb-4 md:mb-0"
        :disabled="loading || !meta.valid"
      >
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { SfButton, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const emit = defineEmits(['on-save']);

const { t } = useI18n();
const { loading } = useCustomer();

const schema = toTypedSchema(
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
  validationSchema: schema,
});

const onSubmit = handleSubmit((values) => {
  emit('on-save', values.cart.customerEmail);
});

const [customerEmail, emailAttributes] = defineField('cart.customerEmail');
</script>
