<template>
  <div class="p-2 sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto">
    <div v-if="recommendedBlock.text">
      <UiFormLabel>Pre-title</UiFormLabel>
      <SfInput v-model="recommendedBlock.text.pretitle" name="preTitle" type="text" placeholder="PreTitle" />
    </div>
    <div v-if="recommendedBlock.text">
      <UiFormLabel>Main Title</UiFormLabel>
      <SfInput v-model="recommendedBlock.text.title" name="Title" type="text" placeholder="Title" />
    </div>
    <div v-if="recommendedBlock.text">
      <UiFormLabel>Subtitle</UiFormLabel>
      <SfInput v-model="recommendedBlock.text.subtitle" name="Subtitle" type="text" placeholder="Subtitle" />
    </div>
    <div v-if="recommendedBlock.text">
      <UiFormLabel>Description</UiFormLabel>
      <SfTextarea
        v-model="recommendedBlock.text.htmlDescription"
        name="description"
        type="text"
        class="w-full min-h-[232px]"
        placeholder="Text that supports HTML formatting"
      />
    </div>
    <label>
      <UiFormLabel>Category ID</UiFormLabel>
      <SfInput v-model="recommendedBlock.categoryId" name="category Id" type="text" placeholder="Enter Category Id" />
    </label>
    <div v-if="recommendedBlock.text">
      <UiFormLabel>Text Color</UiFormLabel>
      <SfInput v-model="recommendedBlock.text.color" type="text">
        <template #suffix>
          <label
            for="text-color"
            :style="{ backgroundColor: recommendedBlock.text.color }"
            class="border border-[#a0a0a0] rounded-lg cursor-pointer"
          >
            <input id="text-color" v-model="recommendedBlock.text.color" type="color" class="invisible w-8" />
          </label>
        </template>
      </SfInput>
    </div>
    <div v-if="recommendedBlock.text">
      <UiFormLabel>Text alignment</UiFormLabel>
      <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          for="text-align-left"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': recommendedBlock.text.textAlignment === 'left',
          }"
          @click="recommendedBlock.text.textAlignment = 'left'"
        >
          <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: recommendedBlock.text.textAlignment !== 'left' }" />
          Left
        </div>

        <div
          for="text-align-center"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': recommendedBlock.text.textAlignment === 'center',
          }"
          @click="recommendedBlock.text.textAlignment = 'center'"
        >
          <SfIconCheck
            class="mr-1 w-[1.1rem]"
            :class="{ invisible: recommendedBlock.text.textAlignment !== 'center' }"
          />
          Center
        </div>

        <div
          for="text-align-right"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': recommendedBlock.text.textAlignment === 'right',
          }"
          @click="recommendedBlock.text.textAlignment = 'right'"
        >
          <SfIconCheck
            class="mr-1 w-[1.1rem]"
            :class="{ invisible: recommendedBlock.text.textAlignment !== 'right' }"
          />
          Right
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from '../ProductRecommendedProducts/types';
import { SfInput, SfTextarea, SfIconCheck } from '@storefront-ui/vue';
const { data } = useHomepage();
const { blockIndex } = useSiteConfiguration();

const recommendedBlock = computed(
  () =>
    (data.value.blocks[blockIndex.value].options || {
      text: {
        pretitle: '',
        title: '',
        subtitle: '',
        htmlDescription: '',
        color: '#000000',
        textAlignment: 'left',
      },
      categoryId: '',
    }) as ProductRecommendedProductsProps,
);
</script>
