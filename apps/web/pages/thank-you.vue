<template>
  <NuxtLazyHydrate when-visible>
    <ConfirmationPageContent v-if="data" :order="data" />
    <SoftLogin v-if="error" :error="error" @submit="loadOrder" />
  </NuxtLazyHydrate>
</template>

<script setup lang="ts">
const route = useRoute();
const { data, error, fetchOrder } = useCustomerOrder('soft-login');
const { send } = useNotification();

if (error.value) {
  send({
    type: 'negative',
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
    orderId: route.query.orderId as string,
    accessKey: route.query.accessKey as string,
    ...object,
  });
};

await loadOrder();
</script>
