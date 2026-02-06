<template>
  <div>
    <!-- New architecture: Split rendering -->
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

// eslint-disable-next-line no-console
console.log('🏠 Homepage - Using NEW architecture with usePageBlocks');

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

// New composable replaces useCategoryTemplate
const { header, main, footer, fetchPageBlocks, setDefaultTemplate } = usePageBlocks(
  route?.meta?.identifier as string,
  route.meta.type as string,
  $i18n.locale.value,
);

// Fallback handling: If no data from API, use JSON templates
const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

// Set default template (for fallback when DB is empty)
const defaultTemplate = useLocaleSpecificHomepageTemplate($i18n.locale.value);
setDefaultTemplate(defaultTemplate);

// Fetch blocks from API (will use defaults if DB is empty)
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
