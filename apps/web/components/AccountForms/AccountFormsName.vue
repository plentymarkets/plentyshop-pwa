<template>
  <form data-testid="account-forms-name" @submit.prevent="$emit('on-save')">
    <div class="md:flex justify-between gap-4">
      <label class="block flex-1">
        <UiFormLabel>{{ $t('account.accountSettings.personalData.firstName') }} {{ $t('form.required') }}</UiFormLabel>
        <SfInput v-model="userData.firstName" name="firstname" type="text" required />
      </label>
      <label class="block flex-1 mt-4 md:mt-0">
        <UiFormLabel>{{ $t('account.accountSettings.personalData.lastName') }} {{ $t('form.required') }}</UiFormLabel>
        <SfInput v-model="userData.lastName" name="lastname" type="text" required />
      </label>
    </div>
    <div class="mt-6 flex flex-col-reverse md:flex-row md:justify-end gap-4">
      <UiButton type="reset" variant="secondary" @click="$emit('on-cancel')">
        {{ $t('contactInfo.cancel') }}
      </UiButton>
      <UiButton type="submit" class="min-w-[120px]"> {{ $t('contactInfo.save') }} </UiButton>
    </div>
  </form>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import type { AccountFormsNameProps } from '~/components/AccountForms/types';

const props = defineProps<AccountFormsNameProps>();
defineEmits(['on-save', 'on-cancel']);

const { firstName, lastName } = toRefs(props);
const userData = ref({
  firstName: firstName?.value ?? '',
  lastName: lastName?.value ?? '',
});
</script>
