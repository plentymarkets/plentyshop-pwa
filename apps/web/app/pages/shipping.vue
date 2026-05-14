<template>
  <div v-if="categoryId">
    <EditableBlocks :identifier="categoryId" type="category" :prevent-blocks-request="true" />
  </div>
  <div v-else-if="templateText" class="w-full p-5 overflow-x-auto break-words no-preflight" v-html="templateText" />
  <h5 v-else class="text-center m-5 p-5">{{ t('shipping.noShippingMessage') }}</h5>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
  skipBlocksFetch: true,
  isBlockified: true,
  type: 'category',
  identifier: 0,
});

const { setPageMeta } = usePageMeta();
const { getSetting } = useSiteSettings('shippingTextCategoryId');
const { categoryTemplateData, fetchCategoryTemplate } = useBlockTemplates();
const { fetchBlocks } = useBlocks();
const { setBlocksListContext } = useBlocksList();

setBlocksListContext('content');

const categoryId = computed(() => Number(getSetting()));

const route = useRoute();
route.meta.identifier = categoryId.value;
route.meta.type = 'category';

await Promise.all([
  fetchBlocks(categoryId.value, 'category'),
  fetchCategoryTemplate(categoryId.value),
]);

const icon = 'page';
setPageMeta(t('orderConfirmation.shipping'), icon);


const templateText = computed(() => (!categoryId.value ? categoryTemplateData?.value?.data : null));

watch(categoryId, async (newCategoryId) => {
  route.meta.identifier = newCategoryId;
  await Promise.all([
    fetchBlocks(newCategoryId, 'category'),
    fetchCategoryTemplate(newCategoryId),
  ]);
});

onMounted(async () => {
  await fetchBlocks(categoryId.value, 'category');
});
</script>
