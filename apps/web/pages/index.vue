<template>
  <EditablePage />
</template>
<script lang="ts" setup>
const { getRobots, setRobotForStaticPage } = useRobots();

await getRobots();
setRobotForStaticPage('Homepage');
</script>
