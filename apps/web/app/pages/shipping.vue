<template>
  <div v-if="hasEditorContent">
    <EditableBlocks :identifier="categoryId" type="category" :prevent-blocks-request="true" />
  </div>

  <div v-else-if="templateText" class="w-full p-5 overflow-x-auto break-words no-preflight" v-html="templateText" />

  <EditableBlocks v-else-if="isInEditor" :identifier="categoryId" type="category" :prevent-blocks-request="true" />

  <div v-else class="w-full p-5 break-words flex items-center justify-center text-center min-h-[200px]">
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
const { categoryTemplateData, fetchCategoryTemplate, clearCategoryTemplate } = useBlockTemplates();
const { fetchBlocks, pageBlocks, updateBlocks } = useBlocks();
const { setBlocksListContext } = useBlocksList();
const { isInEditor } = useEditorState();

setBlocksListContext('content');

const categoryId = computed(() => Number(getSetting()) || 0);

const route = useRoute();
route.meta.identifier = categoryId.value;
route.meta.type = 'category';

if (categoryId.value > 0) {
  await Promise.all([fetchBlocks(categoryId.value, 'category'), fetchCategoryTemplate(categoryId.value)]);
}

setPageMeta(t('orderConfirmation.shipping'), 'page');

const hasEditorContent = computed(() => pageBlocks.value.length > 0);

const templateText = computed(() => (!hasEditorContent.value ? (categoryTemplateData?.value?.data ?? null) : null));

watch(categoryId, async (newCategoryId) => {
  route.meta.identifier = newCategoryId;
  if (newCategoryId > 0) {
    await Promise.all([fetchBlocks(newCategoryId, 'category'), fetchCategoryTemplate(newCategoryId)]);
  } else {
    updateBlocks([]);
    clearCategoryTemplate();
  }
});
</script>
