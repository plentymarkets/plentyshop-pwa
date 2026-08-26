<template>
  <div v-if="hasEditorContent">
    <EditableBlocks :identifier="SHIPPING_PAGE_IDENTIFIER" type="immutable" :prevent-blocks-request="true" />
  </div>

  <div v-else-if="templateText" class="w-full p-5 overflow-x-auto break-words no-preflight" v-html="templateText" />

  <EditableBlocks
    v-else-if="isInEditor"
    :identifier="SHIPPING_PAGE_IDENTIFIER"
    type="immutable"
    :prevent-blocks-request="true"
  />

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
  isBlockified: true,
  type: 'immutable',
  identifier: SHIPPING_PAGE_IDENTIFIER,
});

const { setPageMeta } = usePageMeta();
const { getNumberSetting } = useSiteSettings('shippingTextCategoryId');
const { categoryTemplateData, fetchCategoryTemplate, clearCategoryTemplate } = useBlockTemplates();
const { fetchBlocks, pageBlocks } = useBlocks();
const { setBlocksListContext } = useBlocksList();
const { isInEditor } = useEditorState();

setBlocksListContext('content');

const categoryId = computed(() => getNumberSetting());

/**
 * Loads lagacy category id blocks
 */
const loadBlocks = async (legacyCategoryId: number) => {
  if (pageBlocks.value.length === 0 && legacyCategoryId > 0) {
    await fetchBlocks(legacyCategoryId, 'category');
  }
};

await loadBlocks(categoryId.value);
if (categoryId.value > 0) {
  await fetchCategoryTemplate(categoryId.value);
}

setPageMeta(t('orderConfirmation.shipping'), 'page');

const hasEditorContent = computed(() => pageBlocks.value.length > 0);

const templateText = computed(() => (!hasEditorContent.value ? (categoryTemplateData?.value?.data ?? null) : null));

watch(categoryId, async (newCategoryId) => {
  await loadBlocks(newCategoryId);
  if (newCategoryId > 0) {
    await fetchCategoryTemplate(newCategoryId);
  } else {
    clearCategoryTemplate();
  }
});
</script>
