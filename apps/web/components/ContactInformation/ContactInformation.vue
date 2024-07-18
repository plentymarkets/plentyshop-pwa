<template>
  <div data-testid="contact-information" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ $t('contactInfo.heading') }}</h2>
      <SfButton v-if="!disabled && cart.customerEmail && !isAuthorized" size="sm" variant="tertiary" @click="open">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>
    <p v-if="cart.customerEmail" class="mt-2 md:w-[520px]">{{ cart.customerEmail }}</p>
    <div v-else class="w-full md:max-w-[520px]">
      <p>{{ $t('contactInfo.description') }}</p>
      <SfButton v-if="!disabled" class="mt-4 w-full md:w-auto" variant="secondary" @click="open">
        {{ $t('contactInfo.add') }}
      </SfButton>
    </div>

    <UiModal
      v-if="isOpen"
      v-model="isOpen"
      :disable-click-away="!cart.customerEmail"
      :disable-esc="!cart.customerEmail"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="contact-modal-title"
    >
      <header>
        <SfButton v-if="cart.customerEmail" square variant="tertiary" class="absolute right-2 top-2" @click="close">
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
import type { ContactInformationProps } from '~/components/ContactInformation/types';

const { disabled } = withDefaults(defineProps<ContactInformationProps>(), { disabled: false });

const { data, loginAsGuest, getSession, isAuthorized } = useCustomer();
const { isOpen, open, close } = useDisclosure();
const cart = ref({ customerEmail: data.value?.user?.email ?? data.value?.user?.guestMail ?? '' });
const saveContactInformation = async (email: string) => {
  cart.value.customerEmail = email;
  await loginAsGuest(email);
  await getSession();
  close();
};

watch(
  () => data.value?.user,
  (userData) => {
    cart.value.customerEmail = userData?.email ?? userData?.guestMail ?? '';
  },
  { immediate: true },
);

watch(
  () => cart.value.customerEmail,
  (cartCustomerEmail) => (cartCustomerEmail ? close() : open()),
  { immediate: true },
);
</script>
