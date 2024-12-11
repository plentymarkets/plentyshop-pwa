<template>
  <div class="bg-disabled-100 p-5 rounded-md border-dashed border-2 border-disabled-300 text-center">
    <span class="text-neutral-500">
      <i18n-t keypath="paypal.cookieNotAccepted" scope="global">
        <template #phrase>
          <SfLink @click.prevent="visible = true" tag="button" variant="secondary">
            {{ $t('paypal.openSettings') }}
          </SfLink>
        </template>
      </i18n-t>
    </span>
  </div>
</template>

<script setup lang="ts">
import { SfLink } from '@storefront-ui/vue';
const { visible } = useReadCookieBar();
</script>
