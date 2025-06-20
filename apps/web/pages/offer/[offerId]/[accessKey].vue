<template>
  <NuxtLazyHydrate when-visible>
    <template v-if="Object.keys(data).length > 0 && typeof data === 'object' && !('message' in data)">
      <OfferPageContent :offer="data" @accept="accept" @decline="decline" />
    </template>
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-visible>
    <template v-if="error">
      <SoftLogin :error="error" @submit="loadOffer" />
    </template>
  </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'simplified-header-and-footer',
});

const { data, error, relatedOrder, hasError, fetchOffer, declineOffer, acceptOffer } = useOffer();
const { send } = useNotification();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

const offerId = route.params.offerId ? route.params.offerId.toString() : '';
const accessKey = route.params.accessKey ? route.params.accessKey.toString() : '';

const loadOffer = async (type?: string, value?: string) => {
  const object = type === undefined || type === '' ? {} : { [type]: value };
  await fetchOffer({ offerId: offerId, accessKey: accessKey, ...object });
};

await loadOffer();

const decline = async (text: string) => {
  await declineOffer({ offerId: offerId, accessKey: accessKey, text: text });

  if (!hasError.value) send({ type: 'positive', message: t('contact.success') });
  navigateTo(localePath(paths.home));
};

const accept = async () => {
  await acceptOffer({ offerId: offerId, accessKey: accessKey });

  if (!hasError.value && relatedOrder.value) {
    navigateTo(
      localePath(paths.confirmation + '/' + relatedOrder.value?.order.id + '/' + relatedOrder.value?.order.accessKey),
    );
  }
};
</script>
