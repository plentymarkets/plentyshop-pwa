<template>
  <div>
    <EditablePage :identifier="'index'" :type="'immutable'" />
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
  middleware: ['newsletter-confirmation-client', 'notify-me-interactions'],
});

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

const { $i18n } = useNuxtApp();

const { setPageMeta } = usePageMeta();
const route = useRoute();
const { setDefaultTemplate } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

setDefaultTemplate(useLocaleSpecificHomepageTemplate($i18n.locale.value));

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');

const runtimeConfig = useRuntimeConfig();
const googleVerification = String(runtimeConfig.public.googleSiteVerification || '');
const useGoogleVerification = String(runtimeConfig.public.enableGoogleVerification || 'false');
if (googleVerification && useGoogleVerification == 'true') {
  useHead({
    meta: [
      {
        name: 'google-site-verification',
        content: googleVerification,
      },
    ],
  });
}
</script>
