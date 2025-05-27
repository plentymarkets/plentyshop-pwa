<!--<template>-->
<!--  <div class="footer-settings-view sticky top-[52px]" data-testid="footer-settings-drawer">-->
<!--    <UiAccordionItem-->
<!--      v-model="firstColumnOpen"-->
<!--      data-testid="first-column-section"-->
<!--      summary-active-class="bg-neutral-100 border-t-0"-->
<!--      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"-->
<!--    >-->
<!--      <template #summary>-->
<!--        <h2>First column</h2>-->
<!--      </template>-->
<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Title</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput type="text" data-testid="input-title-column-1">-->
<!--            <template #suffix>-->
<!--              <label for="text-title-column-1" class="rounded-lg cursor-pointer">-->
<!--                <input id="text-title-column-1" type="text" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->
<!--    </UiAccordionItem>-->

<!--    <UiAccordionItem-->
<!--      v-model="secondColumnOpen"-->
<!--      data-testid="second-column-section"-->
<!--      summary-active-class="bg-neutral-100 border-t-0"-->
<!--      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"-->
<!--    >-->
<!--      <template #summary>-->
<!--        <h2>Second column</h2>-->
<!--      </template>-->
<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Title</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput type="text" data-testid="input-title-column-2">-->
<!--            <template #suffix>-->
<!--              <label for="input-title-column-2" class="rounded-lg cursor-pointer">-->
<!--                <input id="input-title-column-2" type="text" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel class="mb-1">Show the link to contact form</UiFormLabel>-->
<!--          <SfSwitch-->
<!--            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="py-2">-->
<!--        <UiFormLabel>Description</UiFormLabel>-->
<!--        <SfTextarea-->
<!--          name="description"-->
<!--          type="text"-->
<!--          class="w-full min-h-[232px]"-->
<!--          placeholder="Description text for the second column"-->
<!--          data-testid="input-text-column-2"-->
<!--        />-->
<!--      </div>-->
<!--    </UiAccordionItem>-->

<!--    <UiAccordionItem-->
<!--      v-model="thirdColumnOpen"-->
<!--      data-testid="third-column-section"-->
<!--      summary-active-class="bg-neutral-100 border-t-0"-->
<!--      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"-->
<!--    >-->
<!--      <template #summary>-->
<!--        <h2>Third column</h2>-->
<!--      </template>-->
<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Title</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput type="text" data-testid="input-title-column-3">-->
<!--            <template #suffix>-->
<!--              <label for="input-title-column-3" class="rounded-lg cursor-pointer">-->
<!--                <input id="input-title-column-3" type="text" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="py-2">-->
<!--        <UiFormLabel>Description</UiFormLabel>-->
<!--        <SfTextarea-->
<!--          name="description"-->
<!--          type="text"-->
<!--          class="w-full min-h-[232px]"-->
<!--          placeholder="Description text for the third column"-->
<!--          data-testid="input-text-column-3"-->
<!--        />-->
<!--      </div>-->
<!--    </UiAccordionItem>-->

<!--    <UiAccordionItem-->
<!--      v-model="fourthColumnOpen"-->
<!--      data-testid="fourth-column-section"-->
<!--      summary-active-class="bg-neutral-100 border-t-0"-->
<!--      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"-->
<!--    >-->
<!--      <template #summary>-->
<!--        <h2>Forth column</h2>-->
<!--      </template>-->
<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Title</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput type="text" data-testid="input-title-column-4">-->
<!--            <template #suffix>-->
<!--              <label for="input-title-column-4" class="rounded-lg cursor-pointer">-->
<!--                <input id="input-title-column-4" type="text" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="py-2">-->
<!--        <UiFormLabel>Description</UiFormLabel>-->
<!--        <SfTextarea-->
<!--          name="description"-->
<!--          type="text"-->
<!--          class="w-full min-h-[232px]"-->
<!--          placeholder="Description text for the forth column"-->
<!--          data-testid="input-text-column-4"-->
<!--        />-->
<!--      </div>-->
<!--    </UiAccordionItem>-->

<!--    <UiAccordionItem-->
<!--      v-model="footerColors"-->
<!--      data-testid="color-column-section"-->
<!--      summary-active-class="bg-neutral-100 border-t-0"-->
<!--      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"-->
<!--    >-->
<!--      <template #summary>-->
<!--        <h2>Color</h2>-->
<!--      </template>-->
<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Text color</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput v-model="footerTextColor" type="text" data-testid="text-color-select">-->
<!--            <template #suffix>-->
<!--              <label-->
<!--                for="footer-text-color"-->
<!--                :style="{ backgroundColor: footerTextColor }"-->
<!--                class="border border-[#a0a0a0] rounded-lg cursor-pointer"-->
<!--              >-->
<!--                <input id="footer-text-color" v-model="footerTextColor" type="color" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Background color</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput v-model="footerBackgroundColor" type="text" data-testid="bg-footer-color-select">-->
<!--            <template #suffix>-->
<!--              <label-->
<!--                for="bg-footer-color"-->
<!--                :style="{ backgroundColor: footerBackgroundColor }"-->
<!--                class="border border-[#a0a0a0] rounded-lg cursor-pointer"-->
<!--              >-->
<!--                <input id="bg-footer-color" v-model="footerBackgroundColor" type="color" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->
<!--    </UiAccordionItem>-->

<!--    <UiAccordionItem-->
<!--      v-model="footNoteOpen"-->
<!--      data-testid="footnote-column-section"-->
<!--      summary-active-class="bg-neutral-100 border-t-0"-->
<!--      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"-->
<!--    >-->
<!--      <template #summary>-->
<!--        <h2>Footnotes</h2>-->
<!--      </template>-->
<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Footnotes text</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput type="text" data-testid="input-footnote">-->
<!--            <template #suffix>-->
<!--              <label for="input-footnote" class="rounded-lg cursor-pointer">-->
<!--                <input id="input-footnote" type="text" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Footnote Text color</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput v-model="footerNoteTextColor" type="text" data-testid="text-color-select">-->
<!--            <template #suffix>-->
<!--              <label-->
<!--                for="footer-text-color"-->
<!--                :style="{ backgroundColor: footerNoteTextColor }"-->
<!--                class="border border-[#a0a0a0] rounded-lg cursor-pointer"-->
<!--              >-->
<!--                <input id="footer-text-color" v-model="footerNoteTextColor" type="color" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="py-2">-->
<!--        <div class="flex justify-between mb-2">-->
<!--          <UiFormLabel>Footnote Background color</UiFormLabel>-->
<!--        </div>-->
<!--        <label>-->
<!--          <SfInput v-model="footerNoteBackgroundColor" type="text" data-testid="bg-footer-color-select">-->
<!--            <template #suffix>-->
<!--              <label-->
<!--                for="bg-footer-color"-->
<!--                :style="{ backgroundColor: footerNoteBackgroundColor }"-->
<!--                class="border border-[#a0a0a0] rounded-lg cursor-pointer"-->
<!--              >-->
<!--                <input id="bg-footer-color" v-model="footerNoteBackgroundColor" type="color" class="invisible w-8" />-->
<!--              </label>-->
<!--            </template>-->
<!--          </SfInput>-->
<!--        </label>-->
<!--      </div>-->
<!--    </UiAccordionItem>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { SfInput, SfTextarea, SfSwitch } from '@storefront-ui/vue';-->

<!--const { footerBackgroundColor, footerTextColor, footerNoteTextColor, footerNoteBackgroundColor } =-->
<!--  useSiteConfiguration();-->
<!--const firstColumnOpen = ref(false);-->
<!--const secondColumnOpen = ref(false);-->
<!--const thirdColumnOpen = ref(false);-->
<!--const fourthColumnOpen = ref(false);-->
<!--const footNoteOpen = ref(false);-->
<!--const footerColors = ref(false);-->
<!--</script>-->
