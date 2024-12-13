<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="text" />
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});
const { data, fetchCategoryTemplate } = useCategoryTemplate();
const runtimeConfig = useRuntimeConfig();
await fetchCategoryTemplate(runtimeConfig.public.shippingTextCategoryId);

const text = computed(() => data?.value?.data);
</script>
