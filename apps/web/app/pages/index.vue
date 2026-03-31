<template>
  <div>
    <div class="chart-wrapper">
      <LineChart
        :data="data"
        :categories="categories"
        :height="300"
        :xFormatter="xFormatter"
        xLabel="Month"
        yLabel="Amount"
      />
    </div>
    <EditableBlocks :identifier="'index'" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>

import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

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
    color: '#3b82f6'
  },
  profit: {
    name: 'Profit',
    color: '#10b981'
  }
};

const xFormatter = (i: number) => data[i]?.month ?? '';
</script>
