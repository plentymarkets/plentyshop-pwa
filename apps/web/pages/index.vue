<template>
  <KelloggsHeroSection></KelloggsHeroSection>
  <LanguageSelector />
  <KelloggsRedBar class="mb-12"></KelloggsRedBar>
  <KelloggsOurProducts></KelloggsOurProducts> 
  <KelloggsOurBenefits></KelloggsOurBenefits>
</template>

<script lang="ts" setup async>
const isEditing = useEditor();
const { formattedHeroItems, mediaData, recommendedProductsCategories } = await useHomepageData();
definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });

const { showNewsletter } = useNewsletter();
</script>



