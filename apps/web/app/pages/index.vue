<template>
  <div>
    <!-- Extension slot: modules can register components here via useExtensionSlot().register().
         Hidden automatically when the extension is disabled — no page refresh needed. -->
    <UiExtensionSlot name="homepage-top" />
    <!-- Countdown banner injected by plenty-pwa-module-prototype.
         useCountdown() pauses the timer and hides the banner when the extension is disabled. -->
    <CountdownBanner />
    <EditableBlocks :identifier="HOMEPAGE_IDENTIFIER" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
  isBlockified: true,
  type: 'immutable',
  identifier: HOMEPAGE_IDENTIFIER,
  middleware: ['newsletter-confirmation-client', 'notifyme-interactions-client'],
  cacheControl: getCacheControl(),
});

const { setPageMeta } = usePageMeta();

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
