<template>
  <div v-html="termsConditions" />
</template>

<script>
import { computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useLegalInformation, legalGetters } from '@vue-storefront/plentymarkets';

export default {
  name: 'TermsAndConditions',
  setup() {
    const { result, load } = useLegalInformation('TermsConditions');

    const termsConditions = computed(() => {
      return legalGetters.getHtml(result.value);
    });

    onSSR(async () => {
      await load('TermsConditions');
    });

    return { termsConditions };
  },
};
</script>
