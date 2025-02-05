<template>
  <div class="site-settings-view sticky top-[52px]">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Block Editing</div>
      <UiButton square variant="tertiary" size="sm" class="!p-0" @click="drawerOpen = false">
        <SfIconClose />
      </UiButton>
    </header>
  </div>
  <form class="w-full space-y-4 absolute bg-white">
<UiAccordionItem
  v-model="textSettings"
  summary-active-class="bg-neutral-100 border-t-0"
  summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
>
<template #summary>
  <h2>Text</h2>
</template>

<div class="py-2">
  <div class="flex justify-between mb-2">
    <UiFormLabel>Pre title</UiFormLabel>
  </div>
  <label>
    <SfInput v-model="textCardBlock.text.pretitle" type="text">
      <template #suffix>
        <label for="pretitle" class="rounded-lg cursor-pointer">
          <input id="pretitle" v-model="textCardBlock.text.pretitle" type="text" class="invisible w-8" />
        </label>
      </template>
    </SfInput>
  </label>
</div>

<div class="py-2">
  <div class="flex justify-between mb-2">
    <UiFormLabel>Title</UiFormLabel>
  </div>
  <label>
    <SfInput v-model="textCardBlock.text.title" type="text">
      <template #suffix>
        <label for="title" class="rounded-lg cursor-pointer">
          <input id="title" v-model="textCardBlock.text.title" type="text" class="invisible w-8" />
        </label>
      </template>
    </SfInput>
  </label>
</div>

<div class="py-2">
  <div class="flex justify-between mb-2">
    <UiFormLabel>Subtitle</UiFormLabel>
  </div>
  <label>
    <SfInput v-model="textCardBlock.text.subtitle" type="text">
      <template #suffix>
        <label for="subtitle" class="rounded-lg cursor-pointer">
          <input id="subtitle" v-model="textCardBlock.text.subtitle" type="text" class="invisible w-8" />
        </label>
      </template>
    </SfInput>
  </label>
</div>

<div class="py-2">
  <UiFormLabel>HTML Description</UiFormLabel>
  <SfTextarea
    id="html-description"
    v-model="textCardBlock.text.htmlDescription"
    name="html-description"
    rows="3"
    class="min-h-[232px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
</div>

<div class="py-2">
  <div class="flex justify-between mb-2">
    <UiFormLabel>Primary color</UiFormLabel>
    <SfTooltip
      label="The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process."
      :placement="'top'"
      :show-arrow="true"
      class="ml-2 z-10"
    >
      <SfIconInfo :size="'sm'" />
    </SfTooltip>
  </div>
  <label>
    <SfInput type="text">
      <template #suffix>
        <label
          for="primary-color"
          :style="{ backgroundColor: textCardBlock.text.color }"
          class="rounded-lg cursor-pointer"
        >
          <input id="primary-color" v-model="textCardBlock.text.color" type="color" class="invisible w-8" />
        </label>
      </template>
    </SfInput>
    <span class="typography-text-xs text-neutral-700">Choose primary color</span>
  </label>
</div>

<fieldset class="py-2">
  <legend class="text-sm font-medium text-gray-700">Text Align</legend>

  <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">

    <label
      for="align-left"
      class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
      :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'left' }"
      @click="textCardBlock.text.textAlignment = 'left'"
    >
      <SfRadio
        id="align-left"
        v-model="textCardBlock.text.textAlignment"
        name="text-align"
        value="left"
        class="hidden"
      />
      <SfIconCheck v-if="textCardBlock.text.textAlignment === 'left'" class="mr-1 w-[1.1rem]" />
      Left
    </label>


    <label
      for="align-center"
      class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
      :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'center' }"
      @click="textCardBlock.text.textAlignment = 'center'"
    >
      <SfRadio
        id="align-center"
        v-model="textCardBlock.text.textAlignment"
        name="text-align"
        value="center"
        class="hidden"
      />
      <SfIconCheck v-if="textCardBlock.text.textAlignment === 'center'" class="mr-1 w-[1.1rem]" />
      Center
    </label>

    <label
      for="align-right"
      class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
      :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'right' }"
      @click="textCardBlock.text.textAlignment = 'right'"
    >
      <SfRadio
        id="align-right"
        v-model="textCardBlock.text.textAlignment"
        name="text-align"
        value="right"
        class="hidden"
      />
      <SfIconCheck v-if="textCardBlock.text.textAlignment === 'right'" class="mr-1 w-[1.1rem]" />
      Right
    </label>
  </div>
</fieldset>
</UiAccordionItem>

<UiAccordionItem
  v-model="buttonSettings"
  summary-active-class="bg-neutral-100 border-t-0"
  summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
>
<template #summary>
  <h2>Button</h2>
</template>

<div class="py-2">
  <div class="flex justify-between mb-2">
    <UiFormLabel>Button Label</UiFormLabel>
  </div>
  <label>
    <SfInput v-model="textCardBlock.button.label" type="text">
      <template #suffix>
        <label for="button-label" class="rounded-lg cursor-pointer">
          <input id="button-label" v-model="textCardBlock.button.label" type="text" class="invisible w-8" />
        </label>
      </template>
    </SfInput>
  </label>
</div>

<div class="py-2">
  <div class="flex justify-between mb-2">
    <UiFormLabel>Button Link</UiFormLabel>
  </div>
  <label>
    <SfInput v-model="textCardBlock.button.link" type="text">
      <template #suffix>
        <label for="button-link" class="rounded-lg cursor-pointer">
          <input id="button-link" v-model="textCardBlock.button.link" type="text" class="invisible w-8" />
        </label>
      </template>
    </SfInput>
  </label>
</div>

<fieldset>
  <legend class="text-sm font-medium text-gray-700">Outline</legend>
  <div class="mt-2 space-y-2">
    <div class="flex items-center">
      <SfInput
        id="align-left"
        name="text-align"
        type="radio"
        value="on"
        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
      />
      <label for="align-left" class="ml-3 block text-sm font-medium text-gray-700">On</label>
    </div>

    <div class="flex items-center">
      <SfInput
        id="align-right"
        name="text-align"
        type="radio"
        value="off"
        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
      />
      <label for="align-right" class="ml-3 block text-sm font-medium text-gray-700">Off</label>
    </div>
  </div>
</fieldset>
</UiAccordionItem>
</form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  SfIconClose,
  SfInput,
  SfTextarea,
  SfRadio,
  SfIconCheck,
  SfIconInfo,
  SfTooltip,

} from '@storefront-ui/vue';
import type { TextCardProps2 } from '~/components/ui/TextCard/types';
const { drawerOpen } = useSiteConfiguration();
const { data } = useHomepage();

const textCardBlock = computed(
  () => data.value.blocks.find((block) => block.name === 'UiTextCard')?.options as TextCardProps2,
);
const textSettings = ref(true);
const buttonSettings = ref(false);

</script>
