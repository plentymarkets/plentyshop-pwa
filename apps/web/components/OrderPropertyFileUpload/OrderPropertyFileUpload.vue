<template>
  <div class="w-full">
    <div class="flex row">
      <label :for="`prop-${productPropertyGetters.getOrderPropertyId(productProperty)}`">
        {{ productPropertyGetters.getOrderPropertyName(productProperty) }} -
        {{ $t('orderProperties.upload.orderPropertyTypeFile') }}
        <span v-if="loading"> {{ $t('orderProperties.upload.uploading') }} </span>
        <span v-if="loaded"> {{ $t('orderProperties.upload.uploaded') }} </span>
      </label>
      <div v-if="hasTooltip" class="w-[28px]">
        <slot name="tooltip" />
      </div>
    </div>

    <div
      v-if="!loaded && !loading"
      class="flex items-center"
      id="drop-area"
      @drop="handleDrop"
      @dragover="handleDragOver"
    >
      <input type="file" ref="uploadForm" hidden @change="handleFileUpload" />
      <div class="w-full">
        <SfButton class="flex justify-center w-full border-dashed border-2" variant="tertiary" @click="openUploadModal">
          <div>
            <div class="w-full flex justify-center">
              <img src="/images/file-upload.svg" :alt="$t('orderProperties.upload.uploadFile')" />
            </div>
            <i18n-t keypath="orderProperties.upload.dragAndDropFileHereOrUpload">
              <template #uploadFile>
                <div class="underline">
                  {{ $t('orderProperties.upload.uploadFile') }}
                </div>
              </template>
            </i18n-t>
          </div>
        </SfButton>
        <div>
          <div class="mr-5">
            <span> {{ $t('orderProperties.upload.acceptedFormats') }}: </span>
            <span v-for="(supportedFormat, i) in Object.keys(supportedFormats)" :key="supportedFormat" class="m-0 p-0">
              <span>
                {{ supportedFormat }}
              </span>
              <span v-if="i < Object.keys(supportedFormats).length - 1">, </span>
            </span>
          </div>
          <span> {{ $t('orderProperties.upload.maximumFileSize') }}: 10mb </span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="w-full border-dashed border-2">
      <div class="m-5 flex justify-center">
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
import { SfButton, SfInput, SfIconClose, SfProgressCircular } from '@storefront-ui/vue';
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
const { send } = useNotification();
const i18n = useI18n();

const supportedFormats = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  txt: 'text/plain',
  obj: 'application/x-tgif',
  eps: 'application/postscript',
  ps: 'application/postscript',
  psd: 'image/vnd.adobe.photoshop',
  sla: 'application/vnd.scribus',
  stp: 'application/step',
  step: 'application/step',
  '3mf': 'model/3mf',
  '3ds': 'image/x-3ds',
  max: 'application/x-3ds',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
};

const loadedFile: Ref<File | null> = ref(null);

const setBufferValues = () => {
  const reader = new FileReader();
  reader.addEventListener('load', (e) => {
    if (loadedFile.value && Object.values(supportedFormats).filter((x) => x === loadedFile.value?.type).length > 0) {
      fileName.value = loadedFile.value.name;
      if (e && e.target && e.target.result) {
        value.value = new Blob([e.target.result], { type: loadedFile.value.type });
        loaded.value = true;
      }
    } else {
      send({
        type: 'negative',
        message: i18n.t('orderProperties.upload.unSupportedFileType'),
      });
    }
  });
  if (loadedFile.value) {
    reader.readAsArrayBuffer(loadedFile.value);
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files.length > 0) {
    loadedFile.value = target.files[0];
    setBufferValues();
  }
};
const clearUploadedFile = () => {
  value.value = null;
  loaded.value = false;
};
const openUploadModal = () => {
  (uploadForm.value as HTMLInputElement).click();
};

const handleDragOver = (event: Event) => {
  event.preventDefault();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    loadedFile.value = event.dataTransfer.files[0];
    setBufferValues();
  }
};
</script>
