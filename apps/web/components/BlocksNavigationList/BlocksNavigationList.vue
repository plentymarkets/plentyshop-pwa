<template>
  <div class="bg-[#F1F3F5] p-5 h-screen max-w-[305px]">
    <div class="overflow-y-auto max-h-[80vh]">
      <div v-for="(category, categoryIndex) in blocksLists" :key="categoryIndex">
        <div class="pb-3">
          {{ category.title }}
        </div>
        <div v-for="(variation, variationIndex) in category.variations" :key="variationIndex" class="relative mb-10">
          <NuxtImg :src="variation.image" class="block mx-auto" :alt="variation.title" width="253" height="120" />
          <button
            class="right-[0] absolute transform -translate-y-1/2 bg-[#72CBEE] text-[#062633] w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          >
            <SfIconAdd class="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blocksLists } from './blocksLists';
import { SfIconAdd } from '@storefront-ui/vue';
</script>