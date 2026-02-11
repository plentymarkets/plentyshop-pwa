<template>
  <div>
    <UiHeader v-if="!hasHeaderBlocks" />
    <EditablePage v-else identifier="index" type="immutable" area="header" prevent-blocks-request />
    <EditablePage identifier="index" type="immutable" area="main" prevent-blocks-request />
    <EditablePage identifier="index" type="immutable" area="footer" prevent-blocks-request />
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
  layout: false,
  middleware: ['newsletter-confirmation-client', 'notifyme-interactions-client'],
});

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

const { $i18n } = useNuxtApp();
const route = useRoute();

const { setDefaultTemplate, data, getBlocksServer, headerBlocks } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  $i18n.locale.value,
);

const hasHeaderBlocks = computed(() => headerBlocks.value.length > 0);
const icon = 'home';
const { setPageMeta } = usePageMeta();
setPageMeta(t('homepage.title'), icon);
setDefaultTemplate(useLocaleSpecificHomepageTemplate($i18n.locale.value));

await getBlocksServer('index', 'immutable');

const { ensureAllGlobalBlocks } = useGlobalBlocks();
const blocksWithGlobals = await ensureAllGlobalBlocks(data.value);
if (blocksWithGlobals.length !== data.value.length) data.value.splice(0, data.value.length, ...blocksWithGlobals);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
