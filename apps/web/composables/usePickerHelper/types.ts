export type ImageType = 'wideScreen' | 'desktop' | 'tablet' | 'mobile';

export interface PickerHelperState {
  selectedImageType: ImageType;
  customLabel: string;
  isUploaderOpen: boolean;
}

export type OpenUploader = (type?: string, label?: string) => void;
export type CloseUploader = () => void;
export type DeleteImage = (imageObj: Record<string, unknown>, type: ImageType) => void;
export type GetImageTypeLabel = (imageType: string, customLabel?: string) => string;

export interface PickerHelperTemplate {
  placeholderImg: string;
  labels: Record<ImageType, string>;
  imageDimensions: Record<ImageType, string>;
  imageTypes: readonly ImageType[];
  deleteImage: DeleteImage;
  isUploaderOpen: Readonly<Ref<boolean>>;
  openUploader: OpenUploader;
  closeUploader: CloseUploader;
  selectedImageType: Readonly<Ref<ImageType>>;
  customLabel: Readonly<Ref<string>>;
  getImageTypeLabel: GetImageTypeLabel;
}

export type UsePickerHelperReturn = () => PickerHelperTemplate;
