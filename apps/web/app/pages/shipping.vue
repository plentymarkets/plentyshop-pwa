<template>
  <div v-if="text" class="w-full p-5 overflow-x-auto no-preflight" v-html="text" />
  <h5 v-else class="text-center m-5 p-5">{{ t('shipping.noShippingMessage') }}</h5>
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});
const { setPageMeta } = usePageMeta();
const { getSetting } = useSiteSettings('shippingTextCategoryId');
const { categoryTemplateData, fetchCategoryTemplate } = useCategoryTemplate();

await fetchCategoryTemplate(Number(getSetting()));
const { t } = useI18n();

const icon = 'page';
setPageMeta(t('orderConfirmation.shipping'), icon);

const text = computed(() => categoryTemplateData?.value?.data);
</script>
