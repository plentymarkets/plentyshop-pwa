<template>
  <div v-html="privacyPolicy" />
</template>

<script>
import { computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useLegalInformation, legalGetters } from '@vue-storefront/plentymarkets';

export default {
  name: 'PrivacyPolicy',
  setup() {
    const { result, load } = useLegalInformation('PrivacyPolicy');

    const privacyPolicy = computed(() => {
      return legalGetters.getHtml(result.value);
    });

    onSSR(async () => {
      await load('PrivacyPolicy');
    });

    return { privacyPolicy };
  },
};
</script>

<style scoped></style>
