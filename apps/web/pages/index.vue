<template>
  <div>
    <EditablePage :identifier="'index'" :type="'immutable'" />
  </div>
  <input type="file" @change="handleFileUpload"/>
</template>

<script lang="ts" setup>
const { uploadStorageItem } = useItemsTable();
definePageMeta({
  pageType: 'static',
  isBlockified: true,
});
const { t } = useI18n();
const { setPageMeta } = usePageMeta();
const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files.length > 0) {
    await uploadStorageItem(target.files[0]);
  }
};
</script>
