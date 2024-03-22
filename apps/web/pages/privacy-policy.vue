<template>
  <div class="flex items-center justify-center">
    <div class="container p-4 overflow-x-auto" v-html="getHTMLTexts()" />
  </div>
</template>

<script setup lang="ts">
const { data, getLegalTexts } = useLegalInformation();

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'PrivacyPolicy',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};
</script>
