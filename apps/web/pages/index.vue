<template>
  <Editor v-if="isEditing" />
  <div v-else class="content">
    <div v-if="loadComponents" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiHeroCarousel :hero-item-props="hero" />
    </div>
    <div v-else class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <UiSkeletonLoader />
    </div>

    <NuxtLazyHydrate when-visible>
      <div v-if="loadComponents" class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiMediaCard
          v-for="(item, index) in mediaCard"
          :key="index"
          :image="item.image"
          :alt="item.alt"
          :text="item.text"
          :alignment="item.alignment"
        />
      </div>
      <div v-else class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiSkeletonLoader v-for="index in 3" :key="index" />
      </div>
    </NuxtLazyHydrate>

    <ProductRecommendedProducts cache-key="homepage" :category-id="'49'" />
  </div>
</template>

<script lang="ts" setup async>
const { isEditing } = useEditor();
const { hero, mediaCard, fetchPageTemplate } = useHomepage();
definePageMeta({ pageType: 'static', middleware: ['newsletter-confirmation'] });

const loadComponents = ref(false);
onMounted(async () => {
  await fetchPageTemplate();
  loadComponents.value = true;
});
</script>
