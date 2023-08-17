<template>
  <form data-testid="contact-information-form" @submit.prevent="$emit('on-save', cart.customerEmail)">
    <label>
      <UiFormLabel>{{ $t('contactInfo.email') }}</UiFormLabel>
      <SfInput name="email" type="email" v-model="cart.customerEmail" required />
    </label>
    <div class="mt-4 flex md:justify-end">
      <SfButton type="reset" class="max-md:w-1/2 mr-4" variant="secondary" @click="clear()">
        {{ $t('contactInfo.clear') }}
      </SfButton>

      <SfButton type="submit" class="max-md:w-1/2" :disabled="loading">
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
