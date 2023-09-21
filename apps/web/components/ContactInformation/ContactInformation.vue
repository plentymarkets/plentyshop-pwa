<template>
  <div data-testid="contact-information" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ $t('contactInfo.heading') }}</h2>
      <SfButton v-if="!disabled && cart.customerEmail && !isAuthorized" size="sm" variant="tertiary" @click="open">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>
    <div v-if="cart.customerEmail" class="mt-2 md:w-[520px]">
      <p>{{ cart.customerEmail }}</p>
    </div>
    <div v-else class="w-full md:max-w-[520px]">
      <p>{{ $t('contactInfo.description') }}</p>
      <SfButton v-if="!disabled" class="mt-4 w-full md:w-auto" variant="secondary" @click="open">
        {{ $t('contactInfo.add') }}
      </SfButton>
    </div>

    <UiModal
      v-model="isOpen"
      :disable-click-away="isEmailEmpty()"
      :disable-esc="isEmailEmpty()"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="contact-modal-title"
    >
      <header>
        <SfButton v-if="!isEmailEmpty()" square variant="tertiary" class="absolute right-2 top-2" @click="close">
          <SfIconClose />
        </SfButton>
        <h3 id="contact-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-4">
          {{ $t('contactInfo.heading') }}
        </h3>
      </header>
      <ContactInformationForm @on-save="saveContactInformation" @on-cancel="close" />
    </UiModal>
  </div>
</template>
<script lang="ts" setup>
import { SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';
import { ContactInformationProps } from "~/components/ContactInformation/types";

const { data, loginAsGuest, getSession, isAuthorized } = useCustomer();
const { isOpen, open, close } = useDisclosure();

withDefaults(defineProps<ContactInformationProps>(), {
  disabled: false
});

const cart = ref({
  customerEmail: '',
});

const isEmailEmpty = () => {
  return cart.value.customerEmail === '';
};

const openContactFormIfNoEmail = () => {
  if (isEmailEmpty() && !isAuthorized.value) {
    open();
  }
};

const saveContactInformation = async (email: string) => {
  cart.value.customerEmail = email;

  await loginAsGuest(email);

  close();
};

const getEmailFromSession = async () => {
  await getSession();
  cart.value.customerEmail = data.value?.user?.email ?? data.value?.user?.guestMail ?? '';
};

await getEmailFromSession();
openContactFormIfNoEmail();
</script>
