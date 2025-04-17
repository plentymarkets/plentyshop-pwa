<template>
  <button @click="getCategories">Here it is</button>
  <div>
    <EditablePage :identifier="'index'" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>
import { useCategoriesSearch } from '~/composables/useCategoriesSearch/useCategoriesSearch';

const { t } = useI18n();
const { setPageMeta } = usePageMeta();
const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { getCategories } = useCategoriesSearch();
</script>
