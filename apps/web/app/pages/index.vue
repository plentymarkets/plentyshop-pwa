<template>
  <div>
    <EditableBlocks :identifier="'index'" :type="'immutable'" :is-root="true" />
  </div>
</template>

<script lang="ts" setup>
import { getHomepageTemplate } from '~/utils/blockTemplates/homepage';
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

const { setPageMeta } = usePageMeta();
const { setDefaultTemplate } = useBlocks();

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const homepageTemplate = await getHomepageTemplate($i18n.locale.value);
setDefaultTemplate(homepageTemplate);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
