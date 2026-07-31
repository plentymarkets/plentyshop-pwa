<template>
  <div class="text-sm mx-4 @md:pb-0">
    <div class="flex items-center">
      <SfCheckbox
        id="terms-checkbox"
        :model-value="checkboxValue"
        :invalid="showErrors"
        class="inline-block mr-2"
        data-testid="checkout-terms-checkbox"
        @update:model-value="(event) => setCheckboxValue(Boolean(event))"
      />
      <label for="terms-checkbox" class="select-none">
        <i18n-t keypath="legal.termsInfo" scope="global">
          <template #terms>
            <UiLink
              :href="localePath(paths.termsAndConditions)"
              target="_blank"
              class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
            >
              {{ t('legal.termsAndConditions') }}
            </UiLink>
          </template>

          <template #cancellationRights>
            <UiLink
              :href="localePath(paths.cancellationRights)"
              target="_blank"
              class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
            >
              {{ t('legal.cancellationRights') }}
            </UiLink>
          </template>

          <template #privacyPolicy>
            <UiLink
              :href="localePath(paths.privacyPolicy)"
              target="_blank"
              class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
            >
              {{ t('legal.privacyPolicy') }}
            </UiLink>
          </template>
        </i18n-t>
      </label>
    </div>
    <div class="text-sm text-neutral-500 mt-1 ml-7">* {{ t('contact.form.asterixHint') }}</div>
    <div v-if="showErrors" class="text-negative-700 text-sm">{{ t('legal.termsRequired') }}</div>
  </div>
</template>

<script setup lang="ts">
import { SfCheckbox } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';

const localePath = useLocalePath();

const { checkboxValue, setCheckboxValue, showErrors } = useAgreementCheckbox('checkoutGeneralTerms');
</script>
