<template>
  <div class="sticky top-0 bg-white z-[100]">
    <div class="relative flex items-center pr-5">
      <div class="">
        <img :src="imagePath" alt="Brand Logo" ref="logo" preload class="h-[54px] w-[54px]" />
      </div>

      <div class="absolute left-1/2 transform -translate-x-1/2">
        <UiLanguageEditor v-if="experimentalAddBlock" />
      </div>
      <div class="ml-auto flex space-x-2">
        <button
          class="self-start text-[#062633] px-2 py-1 rounded-md font-inter font-medium text-sm leading-5 flex items-center md:px-4 md:py-2 md:text-base md:leading-6"
          @click="toggleEdit"
          :disabled="!isEditingEnabled"
          data-testid="edit-preview-button"
        >
          <template v-if="disableActions">
            <SfIconVisibility class="mr-[5px] md:mr-[10px]" />
            Preview
          </template>
          <template v-else>
            <SfIconBase size="xs" viewBox="0 0 18 18" class="mr-[5px] md:mr-[10px] fill-primary-900 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="editPath" fill="black" />
              </svg>
            </SfIconBase>
            Edit
          </template>
        </button>
        <button
          class="self-start bg-[#062633] text-white px-2 py-1 rounded-md font-inter font-medium text-sm leading-5 flex items-center md:px-4 md:py-2 md:text-base md:leading-6"
          :disabled="!isEditingEnabled || !isLocalTemplate()"
          data-testid="edit-save-button"
          @click="updatePageTemplate"
        >
          <template v-if="!loading">
            <SfIconBase size="xs" class="mr-[5px] md:mr-[10px]">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="savePath" fill="white" />
              </svg>
            </SfIconBase>
          </template>
          <template v-if="loading"> <SfLoaderCircular class="animate-spin w-4 h-4 text-white" /> </template>
          <template v-else> Save changes </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';
import { savePath } from '~/assets/icons/paths/save';
import { SfIconBase } from '@storefront-ui/vue';
import { SfIconVisibility } from '@storefront-ui/vue';
const runtimeConfig = useRuntimeConfig();
const { isEditingEnabled, disableActions } = useEditor();

const imagePath = '/images/brand-logo.png';

const { loading } = useHomepage();
const { updatePageTemplate } = useUpdatePageTemplate();

const homepageCategoryId = runtimeConfig.public.homepageCategoryId;
const experimentalAddBlock = runtimeConfig.public.experimentalAddBlock;

const isLocalTemplate = () => typeof homepageCategoryId === 'number';

const toggleEdit = () => {
  disableActions.value = !disableActions.value;
};
</script>
