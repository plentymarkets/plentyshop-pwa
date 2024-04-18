<template>
  <form @submit.prevent="submit" method="POST" class="flex flex-col justify-center rounded-md w-full md:w-[400px] mt-5">
    <label>
      <UiFormLabel>{{ props.title }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput type="text" v-model="input" required />
    </label>

    <SfButton type="submit" class="mt-2" :disabled="loading">
      <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
      <span v-if="!loading">
        {{ $t('softLogin.check') }}
      </span>
    </SfButton>
  </form>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import type { SoftLoginInputProps } from './types';

const { loading } = useCustomerOrder('soft-login');
const props = defineProps<SoftLoginInputProps>();
const emit = defineEmits(['submit']);
const input = ref('');

const submit = () => {
  emit('submit', props.type, input.value);
};
</script>
