<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
import {useRobots} from "../composables/useRobots/useRobot";

const { data, getLegalTexts } = useLegalInformation();
const { setRobotForStaticPage } = useRobots();

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'TermsConditions',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

onMounted(() => {
  setRobotForStaticPage('TermsAndConditions');
});
</script>
