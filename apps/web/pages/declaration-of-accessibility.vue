<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
const { data, getLegalTexts } = useLegalInformation();
const { t } = useI18n();
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('categories.legal.subcategories.declarationOfAccessibility'), icon);

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'DeclarationOfAccessibility',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};
</script>
