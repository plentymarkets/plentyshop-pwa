export interface ImageMetadata {
  width: string;
  height: string;
}

export type MetadataRecord = Record<string, ImageMetadata>;

export type CurrentKey = Ref<string | null>;

export type SetMetadata = (key: string, data: ImageMetadata) => void;

export type GetMetadata = (key: string) => ImageMetadata;

export interface UseImageMetadata {
  metadata: Ref<MetadataRecord>;
  currentKey: CurrentKey;
  setMetadata: SetMetadata;
  getMetadata: GetMetadata;
}
