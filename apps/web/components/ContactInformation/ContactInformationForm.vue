<template>
  <form data-testid="contact-information-form" @submit.prevent="onSubmit" novalidate>
    <label>
      <UiFormLabel>{{ $t('contactInfo.email') }}</UiFormLabel>
      <InputText name="email" type="email"/>
    </label>
    <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
      <SfButton type="reset" class="md:mr-4" variant="secondary" @click="resetForm()">
        {{ $t('contactInfo.clear') }}
      </SfButton>

      <SfButton
        data-testid="contact-information-save-button"
        type="submit"
        class="min-w-[120px] mb-4 md:mb-0"
        :disabled="loading || !meta.valid"
      >
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>
<script setup>
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';

const emit = defineEmits(['on-save']);

const { t } = useI18n()

const { loading } = useCustomer();

const { meta, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    email: yup.string().required(t('errorMessages.email.required')).email(t('errorMessages.email.email')),
  }),
});

const onSubmit = handleSubmit(formValues => {
  emit('on-save', formValues.email)
});
</script>
