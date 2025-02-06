<template>
  <div class="px-2">
    <label>
      <UiFormLabel class="mb-1">Headline</UiFormLabel>
      <SfInput v-model="recomandedBlockValue.headline" name="Headline" type="text" placeholder="Enter Headline" />
    </label>
    <label>
      <UiFormLabel class="mb-1">Category Id</UiFormLabel>
      <SfInput
        v-model="recomandedBlockValue.categoryId"
        name="category Id"
        type="text"
        placeholder="Enter Category Id"
      />
    </label>
    <div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Pre Title</UiFormLabel>
        <SfInput v-model="recomandedBlockValue.text.pretitle" name="preTitle" type="text" placeholder="PreTitle" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Title</UiFormLabel>
        <SfInput v-model="recomandedBlockValue.text.title" name="Title" type="text" placeholder="Title" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Subtitle</UiFormLabel>
        <SfInput v-model="recomandedBlockValue.text.subtitle" name="Subtitle" type="text" placeholder="Subtitle" />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Description</UiFormLabel>
        <SfTextarea
          v-model="recomandedBlockValue.text.htmlDescription"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          placeholder="Text that supports HTML formatting"
        />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Text Color</UiFormLabel>

        <SfInput v-model="recomandedBlockValue.text.color" type="text">
          <template #suffix>
            <label
              for="text-color"
              :style="{ backgroundColor: recomandedBlockValue.text.color }"
              class="rounded-lg cursor-pointer"
            >
              <input id="text-color" v-model="recomandedBlockValue.text.color" type="color" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Textbox Background</UiFormLabel>

        <SfInput v-model="recomandedBlockValue.text.bgcolor" type="text">
          <template #suffix>
            <label
              for="text-bg-color"
              :style="{ backgroundColor: recomandedBlockValue.text.bgcolor }"
              class="rounded-lg cursor-pointer"
            >
              <input
                id="text-bg-color"
                v-model="recomandedBlockValue.text.bgcolor"
                type="color"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium mb-4">Bg Opacity</label>
        <div class="flex items-center gap-4">
          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
            <input
              v-model.number="recomandedBlockValue.text.bgopacity"
              type="range"
              min="0"
              max="1"
              step="0.01"
              class="w-full"
            />
          </div>

          <div class="relative">
            <input
              v-model.number="recomandedBlockValue.text.bgopacity"
              type="number"
              min="0"
              max="1"
              class="w-20 px-2 py-1 border rounded text-color-red-500"
              @input="clampBrightness($event, 'text')"
            />
          </div>
        </div>
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">Text Alignment (y)</UiFormLabel>

        <Multiselect
          v-model="recomandedBlockValue.text.textAlignment"
          :options="['left', 'center', 'right']"
          placeholder="Select align"
          :allow-empty="false"
          class="cursor-pointer"
          select-label=""
          deselect-label="Selected"
        />
      </div>

      <div class="mb-6">
        <UiFormLabel class="mb-1">Textbox Alignment (x)</UiFormLabel>

        <Multiselect
          v-model="recomandedBlockValue.text.justify"
          :options="['top', 'center', 'bottom']"
          placeholder="Select justify"
          :allow-empty="false"
          class="cursor-pointer"
          select-label=""
          deselect-label="Selected"
        />
      </div>

      <div class="mb-6">
        <UiFormLabel class="mb-1">Textbox Alignment (y)</UiFormLabel>

        <Multiselect
          v-model="recomandedBlockValue.text.align"
          :options="['left', 'center', 'right']"
          placeholder="Select an alignment"
          :allow-empty="false"
          class="cursor-pointer"
          select-label=""
          deselect-label="Selected"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
const { data, updateProductRecommendedProductsOptions } = useHomepage();

const recomandedBlock = computed(
  () =>
    (data.value.blocks.find((block: Block) => block.name === 'ProductRecommendedProducts')?.options ||
      {}) as ProductRecommendedProductsOptions,
);

const recomandedBlockValue = reactive({
  ...recomandedBlock.value,
  text: recomandedBlock.value.text || {
    pretitle: '',
    title: '',
    subtitle: '',
    htmlDescription: '',
    color: '#000',
    bgcolor: '#fff',
    bgopacity: 1,
    textAlignment: 'left',
    justify: 'center',
    align: 'left',
  },
});

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);
  recomandedBlockValue.text.bgopacity = clamp(nextValue, 0, 1);
};

watch(
  () => recomandedBlockValue,
  (newVal) => {
    updateProductRecommendedProductsOptions(newVal);
  },
  { deep: true },
);
</script>
