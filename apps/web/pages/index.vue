<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" />
    <EditablePage :identifier="'index'" :type="'immutable'" />
  </div>
</template>
<script lang="ts" setup>
const { data } = useCategoryTemplate();
const dataIsEmpty = computed(() => data.value.length === 0);

const { t } = useI18n();
const { setPageMeta } = usePageMeta();
const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');
</script>
