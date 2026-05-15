<template>
  <div v-if="hasEditorContent">
    <EditableBlocks :identifier="categoryId" type="category" :prevent-blocks-request="true" />
  </div>
  <div v-else-if="templateText" class="w-full p-5 overflow-x-auto break-words no-preflight" v-html="templateText" />
  <div v-else class="w-full p-5 break-words">
    {{ t('shipping.noShippingMessage') }}
  </div>
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
const { fetchBlocks, pageBlocks } = useBlocks();
const { setBlocksListContext } = useBlocksList();

setBlocksListContext('content');

const categoryId = computed(() => Number(getSetting()) || 0);

const route = useRoute();
route.meta.identifier = categoryId.value;
route.meta.type = 'category';

await Promise.all([fetchBlocks(categoryId.value, 'category'), fetchCategoryTemplate(categoryId.value)]);

setPageMeta(t('orderConfirmation.shipping'), 'page');

const hasEditorContent = computed(() => pageBlocks.value.length > 0);

const templateText = computed(() => (!hasEditorContent.value ? (categoryTemplateData?.value?.data ?? null) : null));

watch(categoryId, async (newCategoryId) => {
  route.meta.identifier = newCategoryId;
  await Promise.all([fetchBlocks(newCategoryId, 'category'), fetchCategoryTemplate(newCategoryId)]);
});
</script>
