<template>
  <SfInput v-model="value" :type="type" :invalid="meta.validated && !meta.valid" />
  <ErrorMessage :message="errorMessage" />
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import { useField } from 'vee-validate';
import { InputTextProps } from './types';

const props = withDefaults(defineProps<InputTextProps>(), {
  name: '',
  type: 'text',
});

const { meta, value, errorMessage } = useField<string | number>(() => props.name, props.rules);
</script>
