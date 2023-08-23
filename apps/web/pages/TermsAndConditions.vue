<template>
  <div class="legal-texts" v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
const { data, getLegalTexts } = useLegalInformation();

await getLegalTexts({
  type: 'TermsConditions',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};
</script>
<style>
.legal-texts {
  padding: 20px;
}
</style>
