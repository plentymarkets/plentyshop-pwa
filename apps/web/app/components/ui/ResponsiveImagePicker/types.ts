import type { ImageType } from '~/composables/usePickerHelper/types';

export interface ResponsiveImagePickerProps {
  image: Partial<Record<ImageType, string>>;
}

export interface ResponsiveImagePickerAddPayload {
  image: string;
  name: string;
  type: ImageType;
  applyToAllSizes: boolean;
}

export interface ResponsiveImagePickerDeletePayload {
  type: ImageType;
  applyToAllSizes: boolean;
}
