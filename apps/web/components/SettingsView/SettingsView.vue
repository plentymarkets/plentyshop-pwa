<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">General Settings</div>
      <button data-testid="design-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <UiAccordionItem
      v-model="branding"
      data-testid="color-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Branding</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Logo</UiFormLabel>
          <SfTooltip
            label="The logo is displayed in the header of the onlineshop. For the best performance, you should choose an image file in one of the following formats: SVG, AVIF or WebP. If you choose SVG, the size must be 150 x 40 px. For other formats, the maximum size is 180 px (width) by 80 px (height)."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="headerLogo" type="text" placeholder="Enter URL of the image" data-testid="logo-field" />

          <span class="typography-text-xs text-neutral-700"
            >Ideal dimensions: 150 × 40 px, or a maximum width of 180 px and a maximum height of 80 px.</span
          >
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Favicon</UiFormLabel>
          <SfTooltip
            label="A favicon helps customers recognize your site in browser tabs and bookmarks. It must be an ICO file, as other image formats are not supported."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="favicon" type="text" placeholder="Enter URL of the image" data-testid="logo-field" />

          <span class="typography-text-xs text-neutral-700"
            >Recommended dimensions: A square of 32 × 32 px or 48 × 48 px (180 × 180 px for iPhones/iPads)
          </span>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="socialMedia"
      data-testid="color-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Social Media</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Title for OpenGraph</UiFormLabel>
          <SfTooltip
            label="The Open Graph title appears as the headline when your page is shared on social media."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="ogTitle" type="text" placeholder="Enter URL of the image" data-testid="logo-field" />

          <span class="typography-text-xs text-neutral-700"
            >Optimal length: 40–60 characters (max. ~80) to ensure full visibility in previews.
          </span>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Image for OpenGraph</UiFormLabel>
          <SfTooltip
            label="The Open Graph image is the preview thumbnail shown when your page is shared on social media."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="ogImg" type="text" placeholder="Enter URL of the image" data-testid="logo-field" />

          <span class="typography-text-xs text-neutral-700"
            >Optimal image dimensions: 1200 × 630 px (min. 600 × 315 px) for best display on social media.
          </span>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="optimisation"
      data-testid="color-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Image Optimisation</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel class="mb-1"
            >Convert item images to AVIF
            <SfTooltip
              label="Automatically convert item images to modern formats for reduced file size and faster loading. This may increase cloud storage costs but can lower traffic expenses."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-10"
            >
              <SfIconInfo :size="'sm'" /> </SfTooltip
          ></UiFormLabel>
          <SfSwitch
            v-model="useAvif"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
        <span class="typography-text-xs text-neutral-700"
          >Provides better compression than JPEG, PNG, GIF, and WebP. Supported by most modern browsers, but fewer than
          WebP. If not supported, WebP is used instead (if enabled).
        </span>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel class="mb-1"
            >Convert item images to WebP
            <SfTooltip
              label="Automatically convert item images to modern formats for reduced file size and faster loading. This may increase cloud storage costs but can lower traffic expenses."
              :placement="'top'"
              :show-arrow="true"
              class="ml-2 z-10"
            >
              <SfIconInfo :size="'sm'" /> </SfTooltip
          ></UiFormLabel>
          <SfSwitch
            v-model="useWebp"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
        <span class="typography-text-xs text-neutral-700"
          >Better compression than JPEG, PNG, and GIF. Supported by most modern browsers. If AVIF is enabled, WebP
          serves as a fallback for unsupported browsers.
        </span>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="manufacturedTab"
      data-testid="color-section"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 class="">Manufactured (GPSR)</h2>
      </template>
      <div class="py-2">
        <UiFormLabel class="mb-1"
          >Settings for the item view
          <SfTooltip
            label="Depending on your business, GPSR may require certain manufacturer details to be displayed. Select which ones should appear on your product detail pages."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </UiFormLabel>
        <Multiselect
          v-model="selectedFields"
          :options="fields"
          :multiple="true"
          :close-on-select="false"
          :show-labels="false"
          placeholder="Select fields"
          label="label"
          track-by="value"
          class="w-full"
        >
          <template #selection="{ values }">
            <span class="text-neutral-900">{{ values.map((v: any) => v.label).join(', ') }}</span>
          </template>
        </Multiselect>
      </div>
      <span class="typography-text-xs text-neutral-700">Show these manufacturer details. </span>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconInfo, SfInput, SfTooltip, SfSwitch } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const { headerLogo, favicon, ogTitle, ogImg, useAvif, useWebp, manufactured, closeDrawer } = useSiteConfiguration();

const selectedFieldsRaw = ref<{ label: string; value: string }[]>([]);

const selectedFields = computed({
  get() {
    return selectedFieldsRaw.value;
  },
  set(newValue) {
    const isAllClicked = newValue.some((v) => v.value === 'all');

    if (isAllClicked) {
      const realFields = fields.filter((f) => f.value !== 'all');

      const allSelected = selectedFieldsRaw.value.length === realFields.length;
      selectedFieldsRaw.value = allSelected ? [] : [...realFields];
    } else {
      selectedFieldsRaw.value = newValue.filter((v) => v.value !== 'all');
    }
  },
});

const fields = [
  { label: 'All', value: 'all' },
  { label: 'External Name', value: 'external_name' },
  { label: 'Name', value: 'name' },
  { label: 'Logo Url', value: 'logo_url' },
  { label: 'Homepage', value: 'homepage' },
  { label: 'Street', value: 'street' },
  { label: 'House No.', value: 'house_no' },
  { label: 'Postcode', value: 'postcode' },
  { label: 'Town', value: 'town' },
  { label: 'Country', value: 'country' },
  { label: 'Telephone number', value: 'telephone_number' },
  { label: 'Fax Number', value: 'fax_number' },
  { label: 'Email', value: 'email' },
  { label: 'Legal Name', value: 'legal_name' },
  { label: 'Contact Form', value: 'contact_form' },
];

const branding = ref(false);
const socialMedia = ref(false);
const optimisation = ref(false);
const manufacturedTab = ref(false);
</script>
