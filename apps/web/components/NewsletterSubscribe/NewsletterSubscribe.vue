<template>
  <div class="relative">
    <div class="bg-neutral-100 p-4 sm:p-10 text-center">
      <p class="typography-headline-4 sm:typography-headline-3 font-bold">
        {{ $t('newsletter.heading') }}
      </p>
      <form class="mb-4 flex flex-col gap-4 max-w-[550px] mx-auto items-center" @submit.prevent="subscribeNewsletter()">
        <div class="w-full flex">
          <div class="w-full">
            <SfInput
              v-model="inputValue"
              type="email"
              wrapper-class="grow"
              :placeholder="$t('auth.resetPassword.email')"
            />
          </div>
          <SfButton class="ml-2 h-[40px] flex-shrink-0" type="submit" size="lg" :disabled="loading || turnstile === ''">
            <SfLoaderCircular v-if="loading" />
            <span v-else>{{ $t('newsletter.subscribe') }}</span>
          </SfButton>
        </div>
        <NuxtTurnstile v-model="turnstile" ref="turnstileElement" :options="{ theme: 'light' }" />
      </form>
      <div class="typography-text-xs text-neutral-600">
        <label class="ml-3 text-base text-neutral-900 peer-disabled:text-disabled-900" for="privacyPolicy">
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
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SfButton, SfInput, SfLink, SfLoaderCircular } from '@storefront-ui/vue';

const { subscribe, loading } = useNewsletter();
const localePath = useLocalePath();
const inputValue = ref('');
const turnstile = ref('');
const turnstileElement = ref();

const subscribeNewsletter = async () => {
  if (
    await subscribe({
      email: inputValue.value,
      'cf-turnstile-response': turnstile.value,
      emailFolder: 1,
    })
  ) {
    inputValue.value = '';
  }
  turnstile.value = '';
  turnstileElement.value?.reset();
};
</script>
