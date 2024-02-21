<template>
  <div class="p-5" v-html="getHTMLTexts()" />
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
