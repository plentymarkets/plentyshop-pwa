<template>
  <SfTooltip
    show-arrow
    placement="top"
    :label="t('notifyMe.notifyButtonTooltip')"
    :middleware="[offset(24)]"
  >
    <UiButton
      data-testid="notify-me-button"
      size="lg"
      class="w-full h-full"
      aria-label="Open notification subscription form"
      @click="open"
    >
      <template #prefix>
        <SfIconEmail size="sm" aria-hidden="true" />
      </template>
      {{ t('notifyMe.notifyButton') }}
    </UiButton>
  </SfTooltip>

  <Teleport to="body">
    <UiModal
      v-if="isOpen"
      v-model="isOpen"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="notify-modal-title"
      aria-describedby="notify-modal-description"
    >
      <header>
        <UiButton
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          aria-label="Close notification form"
          @click="close"
        >
          <SfIconClose aria-hidden="true" />
        </UiButton>
        <h3 id="notify-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-4">
          {{ t('outOfStock') }}
        </h3>
        <p id="notify-modal-description" class="text-neutral-700 mb-6">
          {{ t('notifyMe.form.subTitle') }}
        </p>
      </header>

      <form class="space-y-4" aria-label="Back in stock notification form" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-900 mb-2">
            {{ t('notifyMe.form.emailLabel') }}
          </label>
          <SfInput
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('notifyMe.form.emailPlaceholder')"
            required
            class="w-full"
            :disabled="loading"
            @focus="formInteraction"
          />
        </div>

        <div class="flex items-start gap-2">
          <SfCheckbox
            id="privacy-policy"
            v-model="agreedToPolicy"
            :disabled="loading"
            required
            @change="formInteraction"
          />
          <label for="privacy-policy" class="text-sm text-neutral-700">
            <i18n-t keypath="readAndAccepted" tag="span">
              <template #insertText>
                <NuxtLink
                  :to="localePath(paths.privacyPolicy)"
                  class="text-primary-700 underline"
                  target="_blank"
                  aria-label="Privacy policy (opens in new tab)"
                >
                  {{ t('privacyPolicy') }}
                </NuxtLink>
              </template>
            </i18n-t>
          </label>
        </div>

        <NuxtTurnstile
          v-if="turnstileSiteKey && (email.length > 0 || turnstileLoad)"
          ref="turnstileElement"
          v-model="turnstileToken"
          :site-key="turnstileSiteKey"
          :options="{ theme: 'light' }"
          class="flex justify-center"
          aria-label="Security verification"
        />

        <UiButton
          type="submit"
          size="lg"
          class="w-full"
          :disabled="!email || !agreedToPolicy || (turnstileSiteKey.length > 0 && !turnstileToken) || loading"
          :aria-busy="loading"
          aria-label="Subscribe to back in stock notifications"
        >
          <template v-if="loading" #prefix>
            <SfLoaderCircular size="sm" aria-hidden="true" />
          </template>
          <template v-else #prefix>
            <SfIconEmail size="sm" aria-hidden="true" />
          </template>
          {{ t('notifyMe.notifyButton') }}
        </UiButton>
      </form>
    </UiModal>
  </Teleport>
</template>

<script lang="ts" setup>
  import { SfIconEmail, SfIconClose, SfTooltip, SfInput, SfCheckbox, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
  import { offset } from '@floating-ui/vue';
  import { ref } from 'vue';
  import type { NotifyMeComponentProps } from './types';

  const props = defineProps<NotifyMeComponentProps>();

  const { isOpen, open, close } = useDisclosure();
  const { user } = useCustomer();
  const { t, locale } = useI18n();
  const { getSetting } = useSiteSettings('cloudflareTurnstileApiSiteKey');
  const { send } = useNotification();
  const { loading, subscribe } = useNotifyMe();
  const localePath = useLocalePath();

  const turnstileSiteKey = getSetting() ?? '';

  const email = ref(user.value?.email || user.value?.guestMail || '');
  const agreedToPolicy = ref(false);
  const turnstileLoad = ref(false);
  const turnstileToken = ref('');

  const formInteraction = () => {
    if (!turnstileLoad.value) {
      turnstileLoad.value = true;
    }
  };

  const handleSubmit = async () => {
    if (turnstileSiteKey && !turnstileToken.value) {
      send({
        type: 'negative',
        message: t('notifyMe.form.turnstileFailed'),
      });
      return;
    }

    const success = await subscribe({
      lang: locale.value,
      email: email.value,
      variationId: props.variationId,
      'cf-turnstile-response': turnstileToken.value,
    });

    if (success) {
      send({
        type: 'positive',
        message: t('notifyMe.form.success'),
      });
      close();
    }
  };
</script>