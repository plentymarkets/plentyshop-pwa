<template>
  <div v-html="getHTMLTexts()" />
</template>

<script setup lang="ts">
const { data, getLegalTexts } = useLegalInformation();

await getLegalTexts({
  type: 'CancellationRights',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};
</script>
