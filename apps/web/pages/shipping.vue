<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="text" />
  <h5 v-if="!text && noShippingMessage" class="text-center mb-5">{{ noShippingMessage }}</h5>
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});
const { data, fetchCategoryTemplate } = useCategoryTemplate();
const runtimeConfig = useRuntimeConfig();
await fetchCategoryTemplate(Number(runtimeConfig.public.shippingTextCategoryId));
const { t } = useI18n();

const noShippingMessage = t('shipping.noShippingMessage');

const text = computed(() => data?.value?.data);
</script>
