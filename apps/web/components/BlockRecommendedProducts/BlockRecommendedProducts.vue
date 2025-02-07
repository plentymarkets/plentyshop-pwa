<template>
  <div class="p-2 sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto">
    <label>
      <UiFormLabel class="mb-1">Headline</UiFormLabel>
      <SfInput v-model="recommendedBlockValue.headline" name="Headline" type="text" placeholder="Enter Headline" />
    </label>
    <label>
      <UiFormLabel class="mb-1">Category Id</UiFormLabel>
      <SfInput
        v-model="recommendedBlockValue.categoryId"
        name="category Id"
        type="text"
        placeholder="Enter Category Id"
      />
    </label>
    <div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Pre Title</UiFormLabel>
        <SfInput v-model="recommendedBlockValue.text.pretitle" name="preTitle" type="text" placeholder="PreTitle" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Title</UiFormLabel>
        <SfInput v-model="recommendedBlockValue.text.title" name="Title" type="text" placeholder="Title" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Subtitle</UiFormLabel>
        <SfInput v-model="recommendedBlockValue.text.subtitle" name="Subtitle" type="text" placeholder="Subtitle" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Description</UiFormLabel>
        <SfTextarea
          v-model="recommendedBlockValue.text.htmlDescription"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          placeholder="Text that supports HTML formatting"
        />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Text Color</UiFormLabel>

        <SfInput v-model="recommendedBlockValue.text.color" type="text">
          <template #suffix>
            <label
              for="text-color"
              :style="{ backgroundColor: recommendedBlockValue.text.color }"
              class="rounded-lg cursor-pointer"
            >
              <input id="text-color" v-model="recommendedBlockValue.text.color" type="color" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Text alignment</UiFormLabel>
        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            for="text-align-left"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': recommendedBlockValue.text.textAlignment === 'left',
            }"
            @click="recommendedBlockValue.text.textAlignment = 'left'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: recommendedBlockValue.text.textAlignment !== 'left' }"
            />
            Left
          </div>

          <div
            for="text-align-center"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': recommendedBlockValue.text.textAlignment === 'center',
            }"
            @click="recommendedBlockValue.text.textAlignment = 'center'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: recommendedBlockValue.text.textAlignment !== 'center' }"
            />
            Center
          </div>

          <div
            for="text-align-right"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': recommendedBlockValue.text.textAlignment === 'right',
            }"
            @click="recommendedBlockValue.text.textAlignment = 'right'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: recommendedBlockValue.text.textAlignment !== 'right' }"
            />
            Right
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea } from '@storefront-ui/vue';
const { data, updateProductRecommendedProductsOptions } = useHomepage();
const { blockIndex } = useSiteConfiguration();

const recommendedBlock = computed(
  () => (data.value.blocks[blockIndex.value].options || {}) as ProductRecommendedProductsOptions,
);

const recommendedBlockValue = reactive({
  ...recommendedBlock.value,
  text: recommendedBlock.value.text || {
    pretitle: '',
    title: '',
    subtitle: '',
    htmlDescription: '',
    color: '#000',
    textAlignment: 'left',
  },
});
recommendedBlockValue.text.color = recommendedBlockValue.text.color || '#000';

watch(
  () => recommendedBlockValue,
  (newVal) => {
    updateProductRecommendedProductsOptions(newVal);
  },
  { deep: true },
);
</script>
