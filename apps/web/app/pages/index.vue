<template>
  <div>
    <EditableBlocks :identifier="'index'" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>
import { getHomepageTemplate } from '~/utils/blockTemplates/homepage';

definePageMeta({
  pageType: 'static',
  isBlockified: true,
  type: 'immutable',
  identifier: 'index',
  middleware: ['newsletter-confirmation-client', 'notifyme-interactions-client'],
});

const { $i18n } = useNuxtApp();

const { setPageMeta } = usePageMeta();
const route = useRoute();
const { setDefaultTemplate } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

try {
  // eslint-disable-next-line no-console
  console.log('[Homepage] Loading template, t() available?', typeof t === 'function');
  const homepageTemplate = await getHomepageTemplate($i18n.locale.value);
  // eslint-disable-next-line no-console
  console.log('[Homepage] Template loaded successfully');
  setDefaultTemplate(homepageTemplate);
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('[Homepage] Failed to load template:', error);
  throw error;
}

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
