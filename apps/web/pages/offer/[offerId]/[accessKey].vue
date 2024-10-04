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
  pageType: 'static',
});

const { data, error, fetchOffer, declineOffer, acceptOffer } = useOffer();
const { send } = useNotification();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

const loadOffer = async (type?: string, value?: string) => {
  const object = type === undefined || type === '' ? {} : { [type]: value };
  await fetchOffer({
    offerId: route.params.offerId as string,
    accessKey: route.params.accessKey as string,
    ...object,
  });
};

watch(
  () => error.value,
  (value) => {
    if (value) {
      send({
        type: 'warning',
        message: value.error.message,
      });
    }
  },
);

if (error.value) {
  send({
    type: 'negative',
    message: error.value.error.message,
  });
}

await loadOffer();

const decline = async (text: string) => {
  await declineOffer({
    offerId: route.params.offerId as string,
    accessKey: route.params.accessKey as string,
    text: text as string,
  });

  navigateTo(localePath(paths.cart));
  send({
    type: 'positive',
    message: t('contact.success'),
  });
};

const accept = async () => {
  await acceptOffer({
    offerId: route.params.offerId as string,
    accessKey: route.params.accessKey as string,
  });

  if (!error.value) {
    navigateTo(localePath(paths.confirmation + '/' + route.params.offerId + '/' + route.params.accessKey));
  }
};
</script>
