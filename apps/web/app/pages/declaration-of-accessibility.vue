<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});
const { data, getLegalTexts } = useLegalInformation();
const { setPageMeta } = usePageMeta();
const { getRobots, setRobotForStaticPage } = useRobots();

const icon = 'page';
setPageMeta(t('legal.declarationOfAccessibility'), icon);

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'DeclarationOfAccessibility',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

await getRobots();
setRobotForStaticPage('DeclarationOfAccessibility');
</script>
