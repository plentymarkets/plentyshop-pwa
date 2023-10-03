<template>
  <form data-testid="contact-information-form" @submit.prevent="$emit('on-save', cart.customerEmail)">
    <label>
      <UiFormLabel>{{ $t('contactInfo.email') }}</UiFormLabel>
      <SfInput name="email" type="email" v-model="cart.customerEmail" required />
    </label>
    <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
      <SfButton type="reset" class="md:mr-4" variant="secondary">
        {{ $t('contactInfo.clear') }}
      </SfButton>

      <SfButton data-testid="contact-information-save-button" type="submit" class="min-w-[120px] mb-4 md:mb-0" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
        <span v-else>
          {{ $t('contactInfo.save') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>
<script setup>
import { SfButton, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const { loading } = useCustomer();

defineEmits(['on-save']);
const cart = ref({
  customerEmail: '',
});
</script>
