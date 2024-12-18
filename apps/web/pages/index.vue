<template>
  <h1>laskdf</h1>
</template>

<script lang="ts" setup async>
const isEditing = useEditor();
const { formattedHeroItems, mediaData, recommendedProductsCategories } = await useHomepageData();
definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });

const { showNewsletter } = useNewsletter();
</script>



