<template>
  <div v-html="legalDisclosure" />
</template>

<script>
import { computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useLegalInformation, legalGetters } from '@vue-storefront/plentymarkets';

export default {
  name: 'LegalDisclosure',
  setup() {
    const { result, load } = useLegalInformation('LegalDisclosure');

    const legalDisclosure = computed(() => {
      return legalGetters.getHtml(result.value);
    });

    onSSR(async () => {
      await load('LegalDisclosure');
    });

    return { legalDisclosure };
  },
};
</script>

<style scoped></style>
