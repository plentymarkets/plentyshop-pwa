<template>
  <NuxtLazyHydrate when-visible>
    <template v-if="data">
      <ConfirmationPageContent :order="data" />
    </template>
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-visible>
    <template v-if="error">
      <SoftLogin :error="error" @submit="tryLoadAfterSoftLogin" />
    </template>
  </NuxtLazyHydrate>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';
import type { OrderSearchParams } from '@plentymarkets/shop-api';

const route = useRoute();
const { data, error, fetchOrder, fetchOrderClient } = useCustomerOrder('soft-login');
const { send } = useNotification();

definePageMeta({
  pageType: 'static',
});
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
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

const createParams = (type?: string, value?: string) => {
  const params: OrderSearchParams = {
    orderId: route.params.orderId as string,
    accessKey: route.params.accessKey as string,
  };

  if (type === 'name' && value) {
    params.name = value;
  } else if (type === 'postcode' && value) {
    params.postcode = value;
  }
  return params;
};

const tryLoadInitialOrder = async (type?: string, value?: string) => {
  const params = createParams(type, value);
  await fetchOrder(params);
};

const tryLoadAfterSoftLogin = async (type?: string, value?: string) => {
  const params = createParams(type, value);
  await fetchOrderClient(params);
};

await tryLoadInitialOrder();
</script>
