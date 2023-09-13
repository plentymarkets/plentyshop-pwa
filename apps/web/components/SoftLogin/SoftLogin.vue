<template>
  <div class="px-4 md:px-0 mt-10 mb-10">
    <div v-if="errorType === 'login'">
      <div class="text-lg text-center mt-2 font-medium">
        Log in to your account to access your order
      </div>
      <login :is-soft-login="true" @logged-in="$emit('submit', 'login')" />
    </div>

    <div v-if="errorType === 'postcode'" class="flex items-center justify-center flex-col">
      <div class="text-lg text-center mt-2 font-medium">
        Please enter the postcode of an address stored for the order to view the order details.
      </div>
      <SoftLoginInput type="postcode" title="Postcode" @submit="submitToParent" />
    </div>

    <div v-if="errorType === 'fullName'" class="flex items-center justify-center flex-col">
      <div class="text-lg text-center mt-2 font-medium">
        Please enter the last name or company name attached to the order to view the order details.
      </div>
      <SoftLoginInput type="fullName" title="Fullname" @submit="submitToParent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SoftLoginProps } from './types';

const emits = defineEmits(['submit']);
const props = defineProps<SoftLoginProps>();
const errorType = computed(() => props.error.error.data.authType ?? props.error.error.data.type ?? '');

const submitToParent = (type: string, value?: string) => {
  emits('submit', type, value);
};
</script>
