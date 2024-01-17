<template>
  <div class="w-full">
    <div class="flex row">
      <label :for="`prop-${orderPropertyId}`">
        {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
        -
        {{ $t('orderProperties.upload.orderPropertyTypeFile') }}
        <span v-if="loading"> ({{ $t('orderProperties.upload.uploading') }}) </span>
        <span v-if="loaded"> ({{ $t('orderProperties.upload.uploaded') }}) </span>

        <template v-if="orderPropertyLabel.surchargeType">
          ({{ $t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
          {{ $n(productPropertyGetters.getOrderPropertySurcharge(productProperty), 'currency') }})
        </template>
        {{ orderPropertyLabel.surchargeIndicator }}
        <template v-if="orderPropertyLabel.surchargeIndicator && orderPropertyLabel.requiredIndicator"> , </template>
        {{ orderPropertyLabel.requiredIndicator }}
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
        <SfButton class="w-full border-dashed border-2" variant="tertiary" @click="openUploadModal">
          <div class="text-center">
            <div>
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
      <div class="justify-center flex m-5">
        <SfLoaderCircular class="animate-spin" size="3xl" />
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
import { SfButton, SfInput, SfIconClose, SfLoaderCircular } from '@storefront-ui/vue';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { OrderPropertyInputProps } from './types';
import { Ref, ref } from 'vue';

const { uploadFile, loading, getPropertyById } = useProductOrderProperties();
const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);
const property = getPropertyById(orderPropertyId);
const hasTooltip = props.hasTooltip;
const value: Ref<Blob | null> = ref(null);

const uploadForm: Ref<HTMLInputElement | null> = ref(null);
const loaded = ref(false);
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

const upload = async () => {
  if (loadedFile.value && property) {
    const file = await uploadFile(loadedFile.value);

    if (file) {
      loaded.value = true;
      property.property.value = file.data;
    } else {
      loadedFile.value = null;
      loaded.value = false;
      property.property.value = null;
    }
  }
};

const validateType = () => {
  if (loadedFile.value && Object.values(supportedFormats).filter((x) => x === loadedFile.value?.type).length > 0) {
    fileName.value = loadedFile.value.name;
  } else {
    send({
      type: 'negative',
      message: i18n.t('orderProperties.upload.unSupportedFileType'),
    });
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files.length > 0) {
    loadedFile.value = target.files[0];
    validateType();
    upload();
  }
};
const clearUploadedFile = () => {
  value.value = null;
  loaded.value = false;

  if (property) {
    property.property.value = null;
  }
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
    validateType();
    upload();
  }
};
</script>
