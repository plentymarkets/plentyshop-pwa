<template>
  <div>
    <div class="chart-wrapper">
      <LineChart
        :data="data"
        :categories="categories"
        :height="300"
        :x-formatter="xFormatter"
        x-label="Month"
        y-label="Amount"
      />
    </div>
    <EditableBlocks :identifier="'index'" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>
import { getHomepageTemplate } from '~/utils/blockTemplates/homepage';
import type { Locale } from '#i18n';
import { LineChart } from 'vue-chrts';

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
const route = useRoute();
const { setDefaultTemplate } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const homepageTemplate = await getHomepageTemplate($i18n.locale.value);
setDefaultTemplate(homepageTemplate);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');

const data = [
  { month: 'Jan', sales: 100, profit: 50 },
  { month: 'Feb', sales: 120, profit: 55 },
  { month: 'Mar', sales: 180, profit: 80 },
  { month: 'Apr', sales: 110, profit: 40 },
  { month: 'May', sales: 90, profit: 30 },
];

const categories = {
  sales: {
    name: 'Sales',
    color: '#3b82f6',
  },
  profit: {
    name: 'Profit',
    color: '#10b981',
  },
};

const xFormatter = (i: number) => data[i]?.month ?? '';
</script>
