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

fetchOrder({
  orderId: route.query.orderId as string,
  accessKey: route.query.accessKey as string,
});

watch(
  () => error.value,
  (value) => {
    if (value) {
      send({
        type: 'negative',
        message: value.error.message,
      });
    }
  },
);

const loadOrder = (type: string, value?: string) => {
  const object = type === 'login' ? {} : { [type]: value };

  fetchOrder({
    orderId: route.query.orderId as string,
    accessKey: route.query.accessKey as string,
    ...object,
  });
};
</script>
