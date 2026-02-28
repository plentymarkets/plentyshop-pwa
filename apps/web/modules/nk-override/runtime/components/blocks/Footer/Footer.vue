<template>
  <footer
    v-if="resolvedContent"
    class="pt-10"
    :style="{
      backgroundColor: resolvedContent.colors?.background,
      color: resolvedContent.colors?.text,
    }"
    data-testid="footer"
  >
  <!-- Footer -->
    <div class="px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <!-- Footer 1rst column -->
        <div v-if="getColumnSwitches(resolvedContent.column1).length" class="max-w-[280px] break-words">
          <div class="ml-4 text-lg font-medium leading-7">
            {{ resolvedContent.column1?.title }}




            <div class="">
              <SfLink
                :tag="NuxtLink"
                variant="secondary"
                class="no-underline text-neutral-900 hover:cursor-pointer hover:underline active:underline"
                :style="{ color: resolvedContent.colors?.text }"
                :to="localePath('index')"
              >
              <NuxtImg class="h-[37px]" src="https://cdn1.irritop.com/frontend/images/logo/Logo22_black.svg" alt="Irritop GmbH" height="37" />
              </SfLink>

              <div class="text-lg font-medium my-2">{{ getEditorTranslation('Join Our Social Network:') }}</div> 

              <div class="text-sm inline-flex gap-2">
                <Icon name="fa6-brands:square-facebook" size="35px" />
                <Icon name="fa6-brands:square-x-twitter" size="35px" />
              </div> 

              <div class="text-lg mt-2">{{ getEditorTranslation('Contact Informations') }}</div> 
              <div class="text-sm mt-1">
                <p>Irritop GmbH</p>
                <p>{{ getEditorTranslation('Ohmstraße 7, 10179 Berlin, Germany') }}</p>
                <p><a href="mailto:info@irritop.com" class="">info@irritop.com</a></p>
              </div>
            </div> 
            <div class="text-lg font-medium mt-3">
              <span>Hotline: &nbsp;</span> <a href="tel:+493030806982" class="">+49 (0) 30 30806982</a>
            </div>
            <div class="text-sm mt-1">
              <span class="">{{ getEditorTranslation('Montag - Freitag, 09:00 - 15:00') }}</span>
            </div>



          </div>
        </div>
        <!-- Footer 2nd, 3rd, 4th columns with a loop -->
        <div
          v-for="(column, i) in [resolvedContent.column2, resolvedContent.column3, resolvedContent.column4]"
          :key="i"
          class="max-w-[280px] break-words"
        >
          <div class="ml-4 text-lg font-medium leading-7">
            {{ column?.title }}
          </div>
          <div v-if="getColumnSwitches(column).length" class="text-sm">
            <ul>
              <SfListItem
                v-for="switchConfig in getColumnSwitches(column)"
                :key="switchConfig.id"
                class="inline-flex items-center gap-2 w-full hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer focus-visible:outline focus-visible:outline-offset focus-visible:relative focus-visible:z-10 px-4 py-2 !bg-transparent typography-text-sm"
              >
                <SfLink
                  :tag="NuxtLink"
                  variant="secondary"
                  class="no-underline text-neutral-900 hover:cursor-pointer hover:underline active:underline"
                  :style="{ color: resolvedContent.colors?.text }"
                  :to="localePath(switchConfig.link)"
                >
                  {{ switchConfig.translationKey }}
                </SfLink>
              </SfListItem>
            </ul>
            <div
              v-if="column?.description"
              class="custom-html ml-4 text-sm hover:cursor-pointer"
              v-html="column.description"
            />
          </div>
          <!-- Extra code for 4th column -->
          <div
            v-if="i == 2"
            class="flex flex-col gap-2 mt-3"
          >
            <div class="inline-flex gap-2 ustify-center">
              <Icon name="fa6-brands:cc-paypal" size="35px" />
              <Icon name="fa6-brands:cc-visa" size="35px" />
              <Icon name="fa6-brands:cc-mastercard" size="35px" />
            </div>
            <div class="inline-flex gap-2 ustify-center">
              <Icon name="fa6-brands:dhl" size="40px" />
              <Icon name="fa6-brands:fedex" size="40px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- Footnote -->
    <div
      class="mb-[62px] md:mb-2 inline-flex w-full flex-auto typography-text-sm flex-wrap md:flex-nowrap"
      :style="{
        color: resolvedContent.colors?.footnoteText,
        backgroundColor: resolvedContent.colors?.footnoteBackground,
      }"
    >
      <!-- Footnote 1st column-->
      <div class="p-3 md:p-5 flex flex-row w-full justify-center items-center flex-wrap">
        <SfLink
          v-for="switchConfig in getColumnSwitches(resolvedContent.column1)"
          :key="switchConfig.id"

          :tag="NuxtLink"
          :style="{ color: resolvedContent.colors?.footnoteText || undefined }"
          class="p-4 py-2 inline-block whitespace-nowrap no-underline hover:underline active:underline"
          variant="secondary"
          :to="localePath(switchConfig.link)"
        >
          {{ switchConfig.translationKey }}
        </SfLink>
      </div>
      <!-- Footnote 2nd column-->
      <div class="p-3 md:p-5 flex flex-row w-full justify-center items-center flex-wrap md:justify-end">
        <div
        v-if="resolvedContent.footnote && resolvedContent.footnote.trim() !== ''"
        class="text-sm text-center"
        :class="{
          'md:text-left': resolvedContent.footnoteAlign === 'left',
          'md:text-center': resolvedContent.footnoteAlign === 'center',
          'md:text-right': resolvedContent.footnoteAlign === 'right',
        }"
        :style="{ color: resolvedContent.colors?.footnoteText || undefined }"
        v-html="copyrightText + ' | ' + getEditorTranslation('All rights reserved.')"
        />
        <div  
          class="ml-4 text-sm text-center hover:cursor-pointer"
          :class="{
            'md:text-left': resolvedContent.footnoteAlign === 'left',
            'md:text-center': resolvedContent.footnoteAlign === 'center',
            'md:text-right': resolvedContent.footnoteAlign === 'right',
          }"
          :style="{ color: resolvedContent.colors?.footnoteText || undefined }"
        >
          {{ getEditorTranslation('footer declaration') }}
        </div>
      </div>
      

    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import type { FooterProps, NkFooterContent, FooterColumn } from './types';  // NK FooterContent not used anyymore.

const props = defineProps<FooterProps>();
const route = useRoute();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const { getFooterBlock, mapFooterData, FOOTER_SWITCH_DEFINITIONS, createFooterBlock } = useCategoryTemplate();

const shouldRender = computed(() => {
  if (route.meta.isBlockified) return !!props.content;
  return true;
});

const resolvedContent = computed(() => {
  if (!shouldRender.value) return null;

  const block = props.content ? createFooterBlock(props.content, props.meta) : getFooterBlock();

  return mapFooterData(block).content as NkFooterContent;  // NK cast to our own type with footnote description
});

// NK const
const runtimeConfig = useRuntimeConfig();
const copyrightText = `© ${runtimeConfig.public.storename} ${new Date().getFullYear()}`;

const getColumnSwitches = (column: FooterColumn) => {
  return FOOTER_SWITCH_DEFINITIONS.filter((switchConfig) => column[switchConfig.key] === true).map((switchConfig) => ({
    id: `${switchConfig.key}-switch`,
    translationKey: t(switchConfig.shopTranslationKey),
    link: switchConfig.link,
    state: true,
  }));
};
</script>

<style scoped>
::v-deep(.custom-html li) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

::v-deep(.custom-html li:hover) {
  text-decoration: underline;
}
</style>

<i18n lang="json">
{
  "en": {
    "Join Our Social Network:": "Join Our Social Network:",
    "Contact Informations": "Contact Informations",
    "Ohmstraße 7, 10179 Berlin, Germany": "Ohmstraße 7, 10179 Berlin, Germany",
    "Montag - Freitag, 09:00 - 15:00": "Monday - Friday, 09:00 - 15:00",
    "All rights reserved.": "All rights reserved.",
    "footer declaration": "** All prices excl. Shipping and incl. VAT / Subject to modifications and errors. Shipping from Bremen (Germany)."

  },
  "de": {
    "Join Our Social Network:": "Folgen Sie uns auf:",
    "Contact Informations": "Kontaktinformationen",
    "Ohmstraße 7, 10179 Berlin, Germany": "Ohmstraße 7, 10179 Berlin, Deutschland",
    "Montag - Freitag, 09:00 - 15:00": "Montag - Freitag, 09:00 - 15:00",
    "All rights reserved.": "Alle Rechte vorbehalten.",
    "footer declaration": "*Alle Preise zzgl. Versand und inkl. MwSt. / Änderungen und Irrtümer vorbehalten. Versand aus Bremen (Deutschland)."
  }
}
</i18n>