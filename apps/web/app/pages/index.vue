<template>
  <div>
    <EditableHeader :header="header" />
    <EditableMain :main="main" />
    <EditableFooter :footer="footer" />
  </div>
</template>

<script lang="ts" setup>
import type { Block } from '@plentymarkets/shop-api';
import homepageTemplateDataDe from '~/composables/useCategoryTemplate/homepageTemplateDataDe.json';
import homepageTemplateDataEn from '~/composables/useCategoryTemplate/homepageTemplateDataEn.json';
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
  isBlockified: true,
  type: 'immutable',
  identifier: 'index',
  middleware: ['newsletter-confirmation-client', 'notifyme-interactions-client'],
});

const { $i18n } = useNuxtApp();
const route = useRoute();

const { header, main, footer, fetchPageBlocks, setDefaultTemplate } = usePageBlocks(
  route?.meta?.identifier as string,
  route.meta.type as string,
  $i18n.locale.value,
);

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

const defaultTemplate = useLocaleSpecificHomepageTemplate($i18n.locale.value);

const mainOnlyTemplate = defaultTemplate.filter((block) => block.name !== 'Header' && block.name !== 'Footer');
setDefaultTemplate(mainOnlyTemplate);

await fetchPageBlocks('index', 'immutable');

const { setPageMeta } = usePageMeta();
const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
