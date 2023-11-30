<template>
  <div class="relative">
    <div class="bg-neutral-100 p-4 sm:p-10 text-center">
      <p class="typography-headline-4 sm:typography-headline-3 font-bold">
        Subscribe and get discount on your first purchase!
      </p>
      <p class="typography-text-sm sm:typography-text-base my-2 mb-4">
        Be aware of upcoming sales and events. Receive gifts and special offers!
      </p>
      <form class="mb-4 flex flex-col gap-4 max-w-[450px] mx-auto items-center" @submit.prevent="subscribeNewsletter()">
        <div class="w-full">
          <SfInput v-model="inputValue" type="email" wrapper-class="grow" placeholder="Type your email" />
        </div>
        <NuxtTurnstile
          v-model="turnstile"
          ref="turnstileElement"
          :options="{ theme: 'light', language: currentLocale }"
        />
        <SfButton type="submit" size="lg" :disabled="loading || turnstile === ''">
          <SfLoaderCircular v-if="loading" />
          <span v-else>Subscribe to Newsletter</span>
        </SfButton>
      </form>
      <div class="typography-text-xs text-neutral-600">
        To learn how we process your data, visit our <SfLink href="#" class="!text-neutral-600">Privacy Notice</SfLink>.
        You can <SfLink href="#" class="!text-neutral-600">unsubscribe</SfLink> at any time without costs.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SfButton, SfInput, SfLink, SfLoaderCircular } from '@storefront-ui/vue';

const { locale: currentLocale } = useI18n();
const { subscribe, loading } = useNewsletter();
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
