<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
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
              <label for="text-pretitle" class="rounded-lg cursor-pointer">
                <input id="text-pretitle" v-model="textCardBlock.text.pretitle" type="text" class="invisible w-8" />
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
              <label for="text-title" class="rounded-lg cursor-pointer">
                <input id="text-title" v-model="textCardBlock.text.title" type="text" class="invisible w-8" />
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
              <label for="text-subtitle" class="rounded-lg cursor-pointer">
                <input id="text-subtitle" v-model="textCardBlock.text.subtitle" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <UiFormLabel>HTML Description</UiFormLabel>
        <SfTextarea
          id="text-html-description"
          v-model="textCardBlock.text.htmlDescription"
          name="text-html-description"
          rows="3"
          class="min-h-[232px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
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
          <SfInput v-model="textCardBlock.text.color" type="text">
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
          <div
            for="text-align-left"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'left' }"
            @click="textCardBlock.text.textAlignment = 'left'"
          >
            <SfIconCheck
              :class="{ invisible: textCardBlock.text.textAlignment !== 'left' }"
              class="mr-1 w-[1.1rem]"
            />
            Left
          </div>

          <div
            for="text-align-center"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'center' }"
            @click="textCardBlock.text.textAlignment = 'center'"
          >
            <SfIconCheck
              :class="{ invisible: textCardBlock.text.textAlignment !== 'center' }"
              class="mr-1 w-[1.1rem]"
            />
            Center
          </div>

          <div
            for="text-align-right"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'right' }"
            @click="textCardBlock.text.textAlignment = 'right'"
          >
            <SfIconCheck
              :class="{ invisible: textCardBlock.text.textAlignment !== 'right' }"
              class="mr-1 w-[1.1rem]"
            />
            Right
          </div>
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
              <label for="text-button-label" class="rounded-lg cursor-pointer">
                <input id="text-button-label" v-model="textCardBlock.button.label" type="text" class="invisible w-8" />
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
              <label for="text-button-link" class="rounded-lg cursor-pointer">
                <input id="text-button-link" v-model="textCardBlock.button.link" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="flex items-center justify-between w-full py-2">
        <UiFormLabel>Outlined</UiFormLabel>
        <SfSwitch
          v-model="isPrimaryVariant"
          class="checked:before:bg-[#646F68] checked:bg-primary-100 checked:before:hover:bg-white checked:border-[#646F68] hover:border-[#646F68] hover:before:bg-[#646F68] checked:hover:bg-white checked:hover:border-[#646F68]"
        />
      </div>
    </UiAccordionItem>
  </form>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfIconCheck, SfIconInfo, SfTooltip, SfSwitch } from '@storefront-ui/vue';
import type { TextCardProps2 } from '~/components/ui/TextCard/types';
const { data } = useHomepage();

const textCardBlock = computed(
  () => data.value.blocks.find((block) => block.name === 'UiTextCard')?.options as TextCardProps2,
);
const isPrimaryVariant = computed({
  get: () => textCardBlock.value.button?.variant === 'secondary',
  set: (value: boolean) => {
    if (textCardBlock.value.button) {
      textCardBlock.value.button.variant = value ? 'secondary' : 'primary';
    }
  },
});
const textSettings = ref(true);
const buttonSettings = ref(false);
</script>
