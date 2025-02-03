<template>
  <UiAccordionItem
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>Text</h2>
    </template>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Background Color</UiFormLabel>
        <SfTooltip
          label="BLA BLA BLA"
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-10"
        >
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </div>
      <label>
        <SfInput v-model="text.bgColor" type="text">
          <template #suffix>
            <label for="primary-color" class="rounded-lg cursor-pointer">
              <input id="primary-color" v-model="text.bgColor" type="color" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Choose a BG Color</span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Title</UiFormLabel>
        <SfTooltip
          label="BLA BLA BLA"
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-10"
        >
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </div>
      <label>
        <SfInput v-model="text.title" type="text">
          <template #suffix>
            <label for="primary-color" class="rounded-lg cursor-pointer">
              <input id="primary-color" v-model="text.title" type="color" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Choose a BG Color</span>
      </label>
    </div>



  </UiAccordionItem>
  <SfButton id="close" @click="closeEditor"
  ><SfIconCancel class="cursor-pointer"
  /></SfButton>
</template>

<script setup lang="ts">
import { SfIconCancel, SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import type { NewsletterSubscribeProps } from '~/components/NewsletterSubscribe/types';
const props = defineProps<NewsletterSubscribeProps>();
console.log('NewsletterSubscribeEditor', props);

const closeEditor = () => {
  const { isEditing } = useEditor();
  isEditing.value = false;
};
</script>