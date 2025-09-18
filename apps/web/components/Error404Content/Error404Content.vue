<template>
  <div class="my-8 flex items-center justify-center p-4">
    <div class="w-full text-center items-center">
      <h1 class="text-3xl md:text-4xl font-semibold mb-4">
        {{ t('error.pageNotFoundTitle') }}
      </h1>

      <p class="text-xl text-gray-600 mb-8 leading-relaxed">
        {{ t('error.pageNotFoundSubtitle') }}
      </p>

      <div class="flex justify-center mb-6">
        <UiSearch class="w-96"/>
      </div>
      <div class="flex justify-center gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <UiButton v-for="category in categoryTree" :key="category.id" :tag="NuxtLink" :to="localePath('/' + category.details[0].nameUrl)" variant="secondary" class="mt-4">
          {{ category.details[0].name }} <!-- TODO: use sdk getter here and in :to="localepath([getter.path])" as well -->
        </UiButton>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 text-left">
        <!-- <RecommendedProducts :category-id="recommendedProductsCategoryId"/> -->
        <ProductSlider :items="[]"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { data: categoryTree } = useCategoryTree();
const NuxtLink = resolveComponent('NuxtLink');

const recommendedProductsCategoryId = String(categoryTree.value[0]?.id ?? 0); //TODO: get clear what we wanna fetch here. a certain category or popular products? do we have a fetch fo popular products already and after that use a getter from the sdk for it
</script>