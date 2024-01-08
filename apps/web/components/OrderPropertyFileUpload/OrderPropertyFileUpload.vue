<template>
  <div class="w-full">
    <label :for="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`">
      {{ $t('orderProperties.upload.orderPropertyTypeFile') }}
      <span v-if="loading"> {{ $t('orderProperties.upload.uploading') }} </span>
      <span v-if="loaded"> {{ $t('orderProperties.upload.uploaded') }} </span>
    </label>
    <div v-if="!loaded && !loading" class="flex items-center">
      <input type="file" ref="uploadForm" hidden @change="handleFileUpload" />
      <div class="w-full">
        <SfButton class="uploadArea" variant="tertiary" @click="openUploadModal">
          <div align="center">
            <div>
              <img src="/images/file-upload.svg" />
            </div>
            <div class="text-black">{{ $t('orderProperties.upload.dragAndDropFileHereOr') }}</div>
            <div class="underline">
              {{ $t('orderProperties.upload.uploadFile') }}
            </div>
          </div>
        </SfButton>
        <div>
          <div class="mr-5">
            <span> {{ $t('orderProperties.upload.acceptedFormats') }}: </span>
            <span v-for="(suportedFormat, i) in suportedFormats" :key="suportedFormat" class="m-0 p-0">
              <span>
                {{ suportedFormat }}
              </span>
              <span v-if="i < suportedFormats.length - 1">,</span>
            </span>
          </div>
          <span> {{ $t('orderProperties.upload.maximumFileSize') }}: 10mb </span>
        </div>
      </div>

      <div v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </div>
    </div>

    <div v-if="loading" class="uploadArea">
      <div align="center" class="m-5">
        <SfProgressCircular size="3xl" :value="loadingValue">
          <text
            class="font-medium fill-neutral-400"
            text-anchor="middle"
            alignment-baseline="central"
            x="100%"
            y="100%"
          >
            {{ loadingValue }}%
          </text>
        </SfProgressCircular>
      </div>
    </div>

    <div v-if="loaded">
      <SfInput v-model="fileName">
        <template #suffix><SfIconClose @click="clearUploadedFile" /></template>
      </SfInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfIconClose } from '@storefront-ui/vue';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyInputProps } from './types';
import { Ref, ref } from 'vue';
const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
const value: Ref<Blob | null> = ref(null);

const uploadForm: Ref<HTMLInputElement | null> = ref(null);
const loading = ref(false);
const loaded = ref(false);
const loadingValue = ref(25);
const fileName = ref('');

const suportedFormats = [
  'doc',
  'docx',
  'pdf',
  'txt',
  'obj',
  'eps',
  'ps',
  'psd',
  'sla',
  'stp',
  'step',
  '3mf',
  '3ds',
  'max',
  'jpg',
  'png',
  'svg',
];

const loadedFile: Ref<File | null> = ref(null);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files.length > 0) {
    loadedFile.value = target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      if (loadedFile.value) {
        fileName.value = loadedFile.value.name;
        if (e && e.target && e.target.result) {
          value.value = new Blob([e.target.result], { type: loadedFile.value.type });
          loaded.value = true;
        }
      }
    });
    reader.readAsArrayBuffer(target.files[0]);
  }
};
const clearUploadedFile = () => {
  value.value = null;
  loaded.value = false;
};
const openUploadModal = () => {
  (uploadForm.value as HTMLInputElement).click();
};
</script>

<style scoped>
.uploadArea {
  border: 1px dashed black;
  width: 100%;
}
</style>
