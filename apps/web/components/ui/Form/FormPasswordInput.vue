<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'" :minlength="minlength" :pattern="pattern">
    <template #suffix>
      <button type="button" :aria-label="t('passwordVisibilty')" @click="isPasswordVisible = !isPasswordVisible">
        <component :is="isPasswordVisible ? SfIconVisibilityOff : SfIconVisibility" />
      </button>
    </template>
  </SfInput>
</template>

<script setup lang="ts">
import { SfInput, SfIconVisibility, SfIconVisibilityOff } from '@storefront-ui/vue';
import type { FormPasswordProps } from '~/components/ui/Form/types';

defineProps<FormPasswordProps>();

const { t } = useI18n();
const isPasswordVisible = ref<boolean>();
</script>
