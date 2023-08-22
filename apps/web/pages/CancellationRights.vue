<template>
  <div v-html="cancellationRights" />
</template>

<script>
import { computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useLegalInformation, legalGetters } from '@vue-storefront/plentymarkets';

export default {
  name: 'CancellationRights',
  setup() {
    const { result, load } = useLegalInformation('CancellationRights');

    const cancellationRights = computed(() => {
      return legalGetters.getHtml(result.value);
    });

    onSSR(async () => {
      await load('CancellationRights');
    });

    return { cancellationRights };
  },
};
</script>

<style scoped></style>
