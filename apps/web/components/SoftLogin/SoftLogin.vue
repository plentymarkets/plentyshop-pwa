<template>
  <div class="px-4 md:px-0 mt-10 mb-10">
    <div v-if="errorType === TYPE_LOGIN">
      <div class="text-lg text-center mt-2 font-medium">
        {{ $t('softLogin.titleLogin') }}
      </div>
      <login :is-soft-login="true" @logged-in="$emit('submit', 'login')" />
    </div>

    <div v-if="errorType === TYPE_POSTCODE" class="flex items-center justify-center flex-col">
      <div class="text-lg text-center mt-2 font-medium">
        {{ $t('softLogin.titlePostcode') }}
      </div>
      <SoftLoginInput type="postcode" :title="$t('form.postalCodeLabel')" @submit="submitToParent" />
    </div>

    <div v-if="errorType === TYPE_FULL_NAME" class="flex items-center justify-center flex-col">
      <div class="text-lg text-center mt-2 font-medium">
        {{ $t('softLogin.titleFullName') }}
      </div>
      <SoftLoginInput type="fullName" :title="$t('softLogin.fullName')" @submit="submitToParent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SoftLoginProps } from './types';

const emits = defineEmits(['submit']);
const props = defineProps<SoftLoginProps>();
const errorType = computed(() => props.error?.error?.data?.authType ?? props.error?.error?.data?.type ?? '');

const TYPE_LOGIN = 'login';
const TYPE_POSTCODE = 'postcode';
const TYPE_FULL_NAME = 'fullName';

const submitToParent = (type: string, value?: string) => {
  emits('submit', type, value);
};
</script>
