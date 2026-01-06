<template>
  <div class="text-sm mx-4 md:pb-0">
    <div class="flex items-center">
      <label for="terms-checkbox" class="select-none">
        <i18n-t keypath="termsInfoInstant" scope="global">
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
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLink } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';

const localePath = useLocalePath();
const { t } = useI18n();
</script>
