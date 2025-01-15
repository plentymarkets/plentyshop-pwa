<template>
  <div class="w-full">
    <div class="flex row">
      <label :for="`prop-${orderPropertyId}`" class="leading-5 text-sm text-zinc-900">
        {{ productPropertyGetters.getOrderPropertyName(productProperty) }}
        -
        {{ t('orderProperties.upload.orderPropertyTypeFile') }}
        <span v-if="loading"> ({{ t('orderProperties.upload.uploading') }}) </span>
        <span v-if="loaded"> ({{ t('orderProperties.upload.uploaded') }}) </span>

        <template v-if="orderPropertyLabel.surchargeType">
          ({{ t('orderProperties.vat.' + orderPropertyLabel.surchargeType) }}
          {{ n(productPropertyGetters.getOrderPropertySurcharge(productProperty), 'currency') }})
        </template>
        {{ orderPropertyLabel.surchargeIndicator }}
        <template v-if="orderPropertyLabel.surchargeIndicator && orderPropertyLabel.requiredIndicator"> , </template>
        {{ orderPropertyLabel.requiredIndicator }}
      </label>
    </div>

    <div
      v-if="!loaded && !loading"
      id="drop-area"
      class="flex items-center"
      @drop="handleDrop"
      @dragover="handleDragOver"
    >
      <input ref="uploadForm" type="file" hidden @change="handleFileUpload" />
      <div class="w-full">
        <div class="flex items-center">
          <UiButton
            class="w-full border-dashed border-2 flex items-center flex-col !p-5"
            variant="tertiary"
            @click="openUploadModal"
          >
            <NuxtImg src="/images/file-upload.svg" :alt="t('orderProperties.upload.uploadFile')" loading="lazy" />
            <i18n-t keypath="orderProperties.upload.dragAndDropFileHereOrUpload" scope="global">
              <template #uploadFile>
                <div class="underline">
                  {{ t('orderProperties.upload.uploadFile') }}
                </div>
              </template>
            </i18n-t>
          </UiButton>
          <div v-if="hasTooltip" class="w-[28px]">
            <slot name="tooltip" />
          </div>
        </div>
        <div class="text-sm text-neutral-500 mr-5">
          <div class="mr-5">
            <span>{{ t('orderProperties.upload.acceptedFormats') }}: </span>
            <span v-for="(supportedFormat, i) in Object.keys(supportedFormats)" :key="supportedFormat" class="m-0 p-0">
              <span>
                {{ supportedFormat }}
              </span>
              <span v-if="i < Object.keys(supportedFormats).length - 1">, </span>
            </span>
          </div>
          <span>{{ t('orderProperties.upload.maximumFileSize') }}: 10mb</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="w-full border-dashed border-2 justify-center flex p-5">
      <SfLoaderCircular class="animate-spin" size="3xl" />
    </div>

    <div v-if="loaded" class="flex items-center">
      <SfInput v-model="fileName" :wrapper-class="'w-full'">
        <template #suffix><SfIconClose @click="clearUploadedFile" /></template>
      </SfInput>
      <slot v-if="hasTooltip" name="tooltip" class="w-[28px]" />
    </div>

    <ErrorMessage as="span" name="value" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconClose, SfLoaderCircular } from '@storefront-ui/vue';
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { OrderPropertyInputProps } from './types';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

const { t, n } = useI18n();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('properties');
const { uploadFile, getPropertyById } = useProductOrderProperties();
const props = defineProps<OrderPropertyInputProps>();
const productProperty = props.productProperty;
const orderPropertyId = productPropertyGetters.getOrderPropertyId(productProperty);
const orderPropertyLabel = productPropertyGetters.getOrderPropertyLabel(productProperty);
const property = getPropertyById(orderPropertyId);
const isOrderPropertyRequired = productPropertyGetters.isOrderPropertyRequired(productProperty);
const hasTooltip = props.hasTooltip;
const blob: Ref<Blob | null> = ref(null);

const uploadForm: Ref<HTMLInputElement | null> = ref(null);
const loaded = ref(false);
const loading = ref(false);
const { send } = useNotification();

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

const validationSchema = toTypedSchema(
  object({
    value: string().test((value, context) => {
      if (isOrderPropertyRequired && !value) {
        return context.createError({ message: t('errorMessages.requiredField') });
      }
      return true;
    }),
  }),
);

const { defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

registerValidator(validate);

const [fileName] = defineField('value');

const loadedFile: Ref<File | null> = ref(null);

const upload = async () => {
  if (loadedFile.value && property) {
    loading.value = true;
    const file = await uploadFile(loadedFile.value);

    if (file) {
      loaded.value = true;
      property.property.value = file;
    } else {
      loadedFile.value = null;
      loaded.value = false;
      property.property.value = null;
      send({
        type: 'negative',
        message: t('orderProperties.upload.uploadError'),
      });
    }
    loading.value = false;
  }
};

const validateType = () => {
  if (loadedFile.value && Object.values(supportedFormats).filter((x) => x === loadedFile.value?.type).length > 0) {
    fileName.value = loadedFile.value.name;
  } else {
    send({
      type: 'negative',
      message: t('orderProperties.upload.unSupportedFileType'),
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
  blob.value = null;
  loaded.value = false;
  fileName.value = '';

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

watch(
  () => meta.value,
  () => {
    registerInvalidFields(
      meta.value.valid,
      `prop-${orderPropertyId}`,
      productPropertyGetters.getOrderPropertyName(productProperty),
    );
  },
);
</script>
