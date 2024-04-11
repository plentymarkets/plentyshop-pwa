<template>
  <div class="w-full p-5 overflow-x-auto" v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
const { data, getLegalTexts } = useLegalInformation();

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'WithdrawalForm',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};
</script>
