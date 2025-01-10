<template>
  <div data-testid="contact-information" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold">{{ $t('contactInfo.heading') }}</h2>
      <UiButton v-if="!disabled && cart.customerEmail && !isAuthorized" variant="secondary" @click="open">
        <SfIconBase v-if="isMobile" viewBox="0 0 34 40" class="w-6 h-6 pt-[3px]">
          <path :d="penPath" />
        </SfIconBase>
        <template v-else>{{ $t('contactInfo.edit') }}</template>
      </UiButton>
    </div>

    <p v-if="cart.customerEmail" class="mt-4 md:w-[520px]">{{ cart.customerEmail }}</p>
    <div v-else class="w-full md:max-w-[520px]">
      <p>{{ $t('contactInfo.description') }}</p>
      <UiButton v-if="!disabled" class="mt-4 w-full md:w-auto" variant="secondary" @click="open">
        {{ $t('contactInfo.add') }}
      </UiButton>
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
        <UiButton v-if="cart.customerEmail" square variant="tertiary" class="absolute right-2 top-2" @click="close">
          <SfIconClose />
        </UiButton>
        <h3 id="contact-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-4">
          {{ $t('contactInfo.heading') }}
        </h3>
      </header>
      <ContactInformationForm @on-save="saveContactInformation" @on-cancel="close" />
    </UiModal>
  </div>
</template>

<script lang="ts" setup>
import { SfIconBase, SfIconClose, useDisclosure } from '@storefront-ui/vue';
import type { ContactInformationProps } from './types';
import { penPath } from '~/assets/icons/paths/pen';

const { disabled = false } = defineProps<ContactInformationProps>();

const viewport = useViewport();
const { data: sessionData, loginAsGuest, getSession, isAuthorized } = useCustomer();
const { isOpen, open, close } = useDisclosure();
const cart = ref({ customerEmail: sessionData.value?.user?.email ?? sessionData.value?.user?.guestMail ?? '' });
const isMobile = computed(() => viewport.isLessThan('md'));

const saveContactInformation = async (email: string) => {
  cart.value.customerEmail = email;
  await loginAsGuest(email);
  await getSession();
  close();
};

watch(
  () => sessionData.value?.user,
  (userData) => {
    cart.value.customerEmail = userData?.email ?? userData?.guestMail ?? '';
    cart.value.customerEmail ? close() : open();
  },
  { immediate: true },
);
</script>
