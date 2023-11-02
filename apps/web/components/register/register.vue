<template>
  <div class="flex items-center justify-center my-1">
    <form @submit.prevent="registerUser" class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]">
      <label>
        <UiFormLabel>{{ $t('form.emailLabel') }}</UiFormLabel>
        <SfInput name="email" type="email" autocomplete="email" v-model="email" required />
      </label>

      <label>
        <UiFormLabel>{{ $t('form.passwordLabel') }}</UiFormLabel>
        <UiFormPasswordInput
          pattern="^(?=.*[A-Za-z])(?=.*\d)\S{8,}$"
          :title="$t('invalidPassword')"
          name="password"
          autocomplete="current-password"
          v-model="password"
          required
        />
      </label>

      <div class="flex items-center">
        <SfCheckbox
          id="privacyPolicy"
          :selected="privacyPolicy"
          @update:model-value="changePrivacy"
          value="value"
          class="peer"
          required
        />
        <label
          class="ml-3 text-base text-neutral-900 cursor-pointer peer-disabled:text-disabled-900"
          for="privacyPolicy"
        >
          <i18n-t keypath="form.privacyPolicyLabel">
            <template #privacyPolicy>
              <SfLink
                href="/PrivacyPolicy"
                target="_blank"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ $t('privacyPolicy') }}
              </SfLink>
            </template>
          </i18n-t>
          *
        </label>
      </div>

      <div v-if="invalidPrivacyPolicy" class="text-negative-700 text-sm">{{ $t('privacyPolicyRequired') }}</div>

      <SfButton type="submit" class="mt-2" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ $t('auth.signup.submitLabel') }}
        </span>
      </SfButton>
      <div align="center">
        <div class="my-5 font-bold">{{ $t('auth.signup.alreadyHaveAccount') }}</div>
        <SfLink @click="$emit('change-view')" href="#" variant="primary">
          {{ $t('auth.signup.logInLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfLink, SfInput, SfLoaderCircular, SfCheckbox } from '@storefront-ui/vue';

const localePath = useLocalePath();
const { register, loading, setPrivacyPolicy, privacyPolicy } = useCustomer();

definePageMeta({
  layout: false,
});

const emits = defineEmits(['registered', 'change-view']);

const email = ref('');
const password = ref('');
const invalidPrivacyPolicy = ref(false);

const registerUser = async () => {
  if (!privacyPolicy.value) {
    invalidPrivacyPolicy.value = true;
    return;
  }

  await register({ email: email.value, password: password.value });

  emits('registered');
  navigateTo(localePath(paths.home));
};

const changePrivacy = (value: boolean) => {
  invalidPrivacyPolicy.value = false;
  setPrivacyPolicy(value);
};
</script>
