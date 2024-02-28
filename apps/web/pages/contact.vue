<template>
  <NuxtLayout name="default">
    <!-- TODO: remove this code when the re-captcha/back-end call is working -->
    <div v-if="true" class="h-[500px] flex items-center justify-center">
      <h1>{{ t('coming-soon') }}</h1>
    </div>
    <div v-else class="md:max-w-[677px] mx-auto px-4 pt-4 pb-20 md:px-0 md:mt-4">
      <h1 class="font-bold mb-10 typography-headline-3 md:typography-headline-2">
        {{ t('contact.contact') }}
      </h1>
      <p class="mb-10">{{ t('contact.contactShopMessage') }}</p>

      <form data-testid="contact-form" class="flex flex-col rounded-md gap-4" @submit.prevent="onSubmit">
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.nameLabel') }} *</UiFormLabel>
          <SfInput name="name" type="text" v-model="contact.name" required />
        </label>
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.emailLabel') }} *</UiFormLabel>

          <SfInput name="email" type="email" autocomplete="email" v-model="contact.email" required>
            <template #prefix>
              <SfIconEmail />
            </template>
          </SfInput>
        </label>
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.subjectLabel') }}</UiFormLabel>
          <SfInput name="subject" type="text" v-model="contact.subject" />
        </label>
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.order-id') }}</UiFormLabel>
          <SfInput name="order-id" type="text" v-model="contact.orderId" />
        </label>
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.message') }} *</UiFormLabel>
          <SfTextarea
            :placeholder="t('contact.form.message-placeholder')"
            class="w-full"
            name="message"
            v-model="contact.message"
            required
          />
        </label>

        <div class="flex items-center">
          <SfCheckbox
            :invalid="showPrivacyError"
            @change="showPrivacyError = false"
            id="terms"
            v-model="privacyPolicy"
            value="value"
            class="peer"
            required
          />
          <label class="ml-3 text-base text-neutral-900 cursor-pointer peer-disabled:text-disabled-900" for="terms">
            <i18n-t keypath="contact.privacyPolicy">
              <template #privacyPolicy>
                <SfLink
                  :href="localePath(paths.privacyPolicy)"
                  target="_blank"
                  class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                >
                  {{ t('privacyPolicy') }}
                </SfLink>
              </template>
            </i18n-t>
            *
          </label>
        </div>

        <p class="text-sm text-neutral-500 mt-0.5 mb-2">* {{ t('contact.form.asterixHint') }}</p>

        <div class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end gap-4">
          <SfButton
            type="button"
            class="max-md:w-1/2"
            variant="secondary"
            :disabled="isContactLoading"
            @click="clearInputs"
          >
            {{ t('contact.clearAll') }}
          </SfButton>
          <SfButton data-testid="save-address" type="submit" class="min-w-[120px]" :disabled="isContactLoading">
            <SfLoaderCircular v-if="isContactLoading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ t('contact.contactSend') }}
            </span>
          </SfButton>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfCheckbox, SfLink, SfTextarea, SfLoaderCircular, SfIconEmail } from '@storefront-ui/vue';

definePageMeta({
  layout: false,
});

const { loading: isContactLoading, doCustomerContactMail } = useCustomerContact();
const localePath = useLocalePath();
const { t } = useI18n();

const showPrivacyError = ref(false);
const privacyPolicy = ref<boolean>(false);

const defaultContact = ref({
  name: '',
  email: '',
  subject: '',
  orderId: '',
  message: '',
});

const contact = ref({ ...defaultContact.value });

const clearInputs = () => {
  contact.value = { ...defaultContact.value };

  privacyPolicy.value = false;
};

const onSubmit = () => {
  showPrivacyError.value = !privacyPolicy.value;
  if (showPrivacyError.value) {
    return false;
  }

  doCustomerContactMail(contact.value);
};
</script>
