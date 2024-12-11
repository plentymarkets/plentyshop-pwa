<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'" :minlength="minlength" :pattern="pattern">
    <template #suffix>
      <button type="button" :aria-label="$t('passwordVisibilty')" @click="isPasswordVisible = !isPasswordVisible">
        <component :is="isPasswordVisible ? SfIconVisibilityOff : SfIconVisibility" />
      </button>
    </template>
  </SfInput>
</template>

<script setup lang="ts">
import { SfInput, SfIconVisibility, SfIconVisibilityOff } from '@storefront-ui/vue';
import {FormPasswordProps} from './types';

defineProps<FormPasswordProps>();

const isPasswordVisible = ref<boolean>();
</script>
