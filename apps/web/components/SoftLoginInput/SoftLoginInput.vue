<template>
  <form method="POST" class="flex flex-col justify-center rounded-md w-full md:w-[400px] mt-5" @submit.prevent="submit">
    <label>
      <UiFormLabel>{{ props.title }} {{ $t('form.required') }}</UiFormLabel>
      <SfInput v-model="input" type="text" required />
    </label>

    <UiButton type="submit" class="mt-2" :disabled="loading">
      <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
      <span v-if="!loading">
        {{ $t('softLogin.check') }}
      </span>
    </UiButton>
  </form>
</template>

<script setup lang="ts">
import { SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import type { SoftLoginInputProps } from './types';

const { loading } = useCustomerOrder('soft-login');
const props = defineProps<SoftLoginInputProps>();
const emit = defineEmits(['submit']);
const input = ref('');

const submit = () => {
  emit('submit', props.type, input.value);
};
</script>
