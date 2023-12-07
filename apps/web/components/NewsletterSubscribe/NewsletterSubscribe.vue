<template>
  <div class="relative">
    <div class="bg-neutral-100 p-4 sm:p-10 text-center">
      <p class="typography-headline-4 sm:typography-headline-3 font-bold mb-2">
        {{ $t('newsletter.heading') }}
      </p>
      <p class="typography-text-sm sm:typography-text-base my-2 mb-4">
        {{ $t('newsletter.info') }}
      </p>
      <form class="mb-4 flex flex-col gap-2 max-w-[550px] mx-auto items-center" @submit.prevent="subscribeNewsletter()">
        <!-- <div class="w-full flex flex-col sm:flex-row gap-2">
          <SfInput
            v-model="firstNameValue"
            type="email"
            wrapper-class="grow"
            :placeholder="$t('form.firstNameLabel')"
          />
          <SfInput v-model="lastNameValue" type="email" wrapper-class="grow" :placeholder="$t('form.lastNameLabel')" />
        </div> -->
        <div class="w-full flex flex-col sm:flex-row">
          <div class="w-full">
            <SfInput
              v-model="emailValue"
              type="email"
              autocomplete="email"
              required
              wrapper-class="grow"
              :placeholder="$t('auth.resetPassword.email')"
            />
          </div>
        </div>
        <SfButton type="submit" size="lg" :disabled="loading || !turnstile">
          <SfLoaderCircular v-if="loading" />
          <span v-else>{{ $t('newsletter.subscribe') }}</span>
        </SfButton>
        <NuxtTurnstile v-model="turnstile" ref="turnstileElement" :options="{ theme: 'light' }" class="mt-4" />
      </form>
      <div class="text-base text-neutral-900 peer-disabled:text-disabled-900">
        <div class="flex justify-center items-center">
          <SfCheckbox
            :model-value="checkboxValue"
            @update:model-value="(event) => setCheckboxValue(event)"
            :invalid="showErrors"
            id="terms-checkbox"
            class="inline-block mr-2"
            data-testid="checkout-terms-checkbox"
          />
          <div class="text-left">
            <i18n-t keypath="newsletter.policy">
              <template #privacyPolicy>
                <SfLink
                  :href="localePath(paths.privacyPolicy)"
                  target="_blank"
                  class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                >
                  {{ $t('privacyPolicy') }}
                </SfLink>
              </template>
            </i18n-t>
          </div>
        </div>
        <div v-if="showErrors" class="text-negative-700 text-sm mt-2">{{ $t('newsletter.termsRequired') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SfButton, SfCheckbox, SfInput, SfLink, SfLoaderCircular } from '@storefront-ui/vue';

const { checkboxValue, setCheckboxValue, showErrors } = useAgreementCheckbox('newsletterSubscribeTerms');
const { subscribe, loading } = useNewsletter();
const { send } = useNotification();
const localePath = useLocalePath();
const { t } = useI18n();
const emailValue = ref('');
// const firstNameValue = ref('');
// const lastNameValue = ref('');

const turnstile = ref('');
const turnstileElement = ref();

const subscribeNewsletter = async () => {
  if (checkboxValue.value === false) {
    setCheckboxValue(false);
    return;
  }

  if (
    await subscribe({
      email: emailValue.value,
      'cf-turnstile-response': turnstile.value,
      emailFolder: 1,
      // firstName: firstNameValue.value,
      // lastName: lastNameValue.value,
    })
  ) {
    send({
      type: 'positive',
      message: t('newsletter.success'),
    });
    emailValue.value = '';
    // firstNameValue.value = '';
    // lastNameValue.value = '';
  }
  turnstile.value = '';
  turnstileElement.value?.reset();
};
</script>
