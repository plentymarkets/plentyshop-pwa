<template>
  <NuxtLazyHydrate when-visible>
    <template v-if="data">
      <ConfirmationPageContent :order="data" />
    </template>
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-visible>
    <template v-if="error">
      <SoftLogin :error="error" @submit="loadOrder" />
    </template>
  </NuxtLazyHydrate>
</template>

<script setup lang="ts">
const route = useRoute();
const { data, error, fetchOrder } = useCustomerOrder('soft-login');
const { send } = useNotification();

definePageMeta({
  pageType: 'static',
});

if (error.value) {
  send({
    type: 'warning',
    message: error.value.error.message,
  });
}

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

const loadOrder = async (type?: string, value?: string) => {
  const object = type === undefined || type === '' ? {} : { [type]: value };

  await fetchOrder({
    orderId: route.params.orderId as string,
    accessKey: route.params.accessKey as string,
    ...object,
  });
};

await loadOrder();
</script>
