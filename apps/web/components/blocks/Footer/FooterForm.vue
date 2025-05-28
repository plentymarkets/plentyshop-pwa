<template>
  <div class="footer-settings-view sticky top-[52px]" data-testid="footer-settings-drawer">
    <UiAccordionItem
      v-model="firstColumnOpen"
      data-testid="first-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>First column</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Title</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.column1.title" type="text" data-testid="input-title-column-1">
            <template #suffix>
              <label for="text-title-column-1" class="rounded-lg cursor-pointer">
                <input
                  id="text-title-column-1"
                  v-model="footerSettings.column1.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="secondColumnOpen"
      data-testid="second-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Second column</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Title</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.column2.title" type="text" data-testid="input-title-column-2">
            <template #suffix>
              <label for="input-title-column-2" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-2"
                  v-model="footerSettings.column2.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel class="mb-1">Show the link to contact form</UiFormLabel>
          <SfSwitch
            v-model="footerSettings.column2.showContactLink"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
      </div>

      <div class="py-2">
        <UiFormLabel>Description</UiFormLabel>
        <SfTextarea
          v-model="footerSettings.column2.description"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          placeholder="Description text for the second column"
          data-testid="input-text-column-2"
        />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="thirdColumnOpen"
      data-testid="third-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Third column</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Title</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.column3.title" type="text" data-testid="input-title-column-3">
            <template #suffix>
              <label for="input-title-column-3" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-3"
                  v-model="footerSettings.column3.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <UiFormLabel>Description</UiFormLabel>
        <SfTextarea
          v-model="footerSettings.column3.description"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          placeholder="Description text for the third column"
          data-testid="input-text-column-3"
        />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="fourthColumnOpen"
      data-testid="fourth-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Forth column</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Title</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.column4.title" type="text" data-testid="input-title-column-4">
            <template #suffix>
              <label for="input-title-column-4" class="rounded-lg cursor-pointer">
                <input id="input-title-column-4" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <UiFormLabel>Description</UiFormLabel>
        <SfTextarea
          v-model="footerSettings.column4.description"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          placeholder="Description text for the forth column"
          data-testid="input-text-column-4"
        />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="footerColors"
      data-testid="color-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Color</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Text color</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.colors.text" type="text" data-testid="text-color-select">
            <template #suffix>
              <label
                for="footer-text-color"
                :style="{ backgroundColor: footerSettings.colors.text }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input id="footer-text-color" v-model="footerSettings.colors.text" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Background color</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.colors.background" type="text" data-testid="bg-footer-color-select">
            <template #suffix>
              <label
                for="bg-footer-color"
                :style="{ backgroundColor: footerSettings.colors.background }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="bg-footer-color"
                  v-model="footerSettings.colors.background"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="footNoteOpen"
      data-testid="footnote-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Footnotes</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Footnotes text</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.footnote" type="text" data-testid="input-footnote">
            <template #suffix>
              <label for="input-footnote" class="rounded-lg cursor-pointer">
                <input id="input-footnote" v-model="footerSettings.footnote" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
      <div class="py-2">
        <UiFormLabel>Footnote Alignment</UiFormLabel>

        <div
          class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
        >
          <div
            for="footnoteAlign-align-left"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
                  'bg-gray-100 text-gray-900 font-semibold': footerSettings.footnoteAlign === 'left',
                }"
            data-testid="footnoteAlign-textbox-y-align-left"
            @click="footerSettings.footnoteAlign = 'left'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: footerSettings.footnoteAlign !== 'left' }" />
            Left
          </div>

          <div
            for="footnoteAlign-align-center"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
                  'bg-gray-100 text-gray-900 font-semibold': footerSettings.footnoteAlign === 'center',
                }"
            data-testid="footnoteAlign-textbox-y-align-center"
            @click="footerSettings.footnoteAlign = 'center'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: footerSettings.footnoteAlign !== 'center' }" />
            Center
          </div>

          <div
            for="footnoteAlign-align-right"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
                  'bg-gray-100 text-gray-900 font-semibold': footerSettings.footnoteAlign === 'right',
                }"
            data-testid="footnoteAlign-textbox-y-align-right"
            @click="footerSettings.footnoteAlign = 'right'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: footerSettings.footnoteAlign !== 'right' }" />
            Right
          </div>
        </div>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Footnote Text color</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.colors.noteText" type="text" data-testid="footnote-text-color-select">
            <template #suffix>
              <label
                for="footnote-text-color"
                :style="{ backgroundColor: footerSettings.colors.noteText }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="footnote-text-color"
                  v-model="footerSettings.colors.noteText"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Footnote Background color</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerSettings.colors.noteBackground" type="text" data-testid="footnote-bg-color-select">
            <template #suffix>
              <label
                for="footnote-bg-color"
                :style="{ backgroundColor: footerSettings.colors.noteBackground }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="footnote-bg-color"
                  v-model="footerSettings.colors.noteBackground"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfSwitch, SfIconCheck } from '@storefront-ui/vue';

const { footerSettings } = useSiteConfiguration();
const firstColumnOpen = ref(false);
const secondColumnOpen = ref(false);
const thirdColumnOpen = ref(false);
const fourthColumnOpen = ref(false);
const footNoteOpen = ref(false);
const footerColors = ref(false);
</script>
