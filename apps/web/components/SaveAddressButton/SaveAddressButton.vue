<template>
    <SfButton
      data-testid="save-address"
      type="button"
      class="min-w-[120px] ml-auto my-2"
      :disabled="isLoading"
      @click="save"
    >
      <SfLoaderCircular v-if="isLoading" class="flex justify-center items-center" size="sm" />
      <span v-else>
        {{ $t('contactInfo.save') }}
      </span>
    </SfButton>
</template>

<script setup lang="ts">
import { SaveAddressButtonProps } from './types';
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';

defineProps<SaveAddressButtonProps>();
</script>
