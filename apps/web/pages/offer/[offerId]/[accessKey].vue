<template>
  <NuxtLazyHydrate when-visible>
    <template v-if="Object.keys(data).length > 0">
      <OfferPageContent :offer="data" :offer-loading="loadingOffer.value" />
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

const { data, loading: offerLoading, error, fetchOffer } = useOffer();
const { send } = useNotification();
const route = useRoute();

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
const loadingOffer = computed(() => offerLoading);
</script>
