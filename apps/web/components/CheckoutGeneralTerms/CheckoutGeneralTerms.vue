<template>
  <div class="text-sm mx-4 md:pb-0">
    <div class="flex items-center">
      <SfCheckbox
        :model-value="checkboxValue"
        @update:model-value="(event) => setCheckboxValue(event)"
        :invalid="showErrors"
        id="terms-checkbox"
        class="inline-block mr-2"
        data-testid="checkout-terms-checkbox"
      />
      <div>
        <i18n-t keypath="termsInfo">
          <template #terms>
            <SfLink
              :href="localePath(paths.termsAndConditions)"
              target="_blank"
              class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
            >
              {{ t('termsAndConditions') }}
            </SfLink>
          </template>

          <template #cancellationRights>
            <SfLink
              :href="localePath(paths.cancellationRights)"
              target="_blank"
              class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
            >
              {{ t('cancellationRights') }}
            </SfLink>
          </template>

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
      </div>
    </div>
    <div v-if="showErrors" class="text-negative-700 text-sm mt-2">{{ t('termsRequired') }}</div>
  </div>
</template>

<script setup lang="ts">
import { SfCheckbox, SfLink } from '@storefront-ui/vue';

const { t } = useI18n();
const localePath = useLocalePath();

const { checkboxValue, setCheckboxValue, showErrors } = useAgreementCheckbox('checkoutGeneralTerms');
</script>
