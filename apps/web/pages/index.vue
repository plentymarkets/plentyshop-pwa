<template>
  <!-- <Editor v-if="isEditing" /> -->
  <!-- <div v-else class="content"> -->
  <!-- <ClientOnly>
      <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiHeroCarousel :hero="homepage.hero" />
      </div>

      <template #fallback>
        <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
          <UiSkeletonLoader style="height: 567px" />
        </div>
      </template>
    </ClientOnly> -->

  <!-- <NuxtLazyHydrate when-visible>
      <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
        <UiMediaCard
          v-for="(item, index) in homepage.mediaCard"
          :key="index"
          :image="item.image"
          :alt="item.alt"
          :text="item.text"
          :alignment="item.alignment"
        />
      </div>
    </NuxtLazyHydrate> -->

  <!-- <div class="max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10">
      <template v-for="(item, index) in homepage.featured" :key="index">
        <section class="mb-10 overflow-hidden">
          <p data-testid="recommended-products" class="mb-4 typography-text-lg text-center md:text-left">
            {{ item.headline }}
          </p>
          <ProductRecommendedProducts cache-key="homepage" :category-id="item.categoryId" />
        </section>
      </template>

      <NuxtLazyHydrate when-visible>
        <NewsletterSubscribe v-if="showNewsletter" />
      </NuxtLazyHydrate>
    </div> -->
  <div>
    <Editor v-if="isEditing" :block="currentBlock" />
    <div v-else class="content">
      <template v-for="(block, index) in testEn.blocks" :key="index">
        <div class="relative max-w-screen-3xl mx-auto md:px-6 lg:px-10 mb-10 group">
          <button
            @click="editBlock(block)"
            class="absolute right-0 top-0 mt-2 mr-2 p-2 bg-blue-500 text-white rounded hidden group-hover:block"
          >
            Edit
          </button>
          <component :is="getComponent(block.name)" v-bind="block.options" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import testEn from './testEn.json';

const isEditing = ref(false);
const currentBlock = ref(null);

const editBlock = (block: any) => {
  currentBlock.value = block;
  isEditing.value = true;
};

const getComponent = (name: string) => {
  if (name === 'UiSkeletonLoader') {
    return resolveComponent('UiSkeletonLoader');
  }

  if (name === 'UiHeroCarousel') {
    return resolveComponent('UiHeroCarousel');
  }

  if (name === 'UiMediaCard') {
    return resolveComponent('UiMediaCard');
  }

  if (name === 'ProductRecommendedProducts') {
    return resolveComponent('ProductRecommendedProducts');
  }
};
</script>
