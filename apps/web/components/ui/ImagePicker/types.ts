export interface ImagePickerProps {
  label: string;
  image: string | undefined;
  placeholder: string;
  dimensions: string;
  tooltip?: string;
  selectedImageType?: string;
}