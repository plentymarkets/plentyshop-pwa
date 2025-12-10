export interface Asset {
  id: number;
  configId: number;
  language: string | null;
  type: string;
  name: string;
  assetKey: string | null;
  content: string;
  isActive: boolean;
  placement: string;
  order: number;
  scope: string | null;
  attributes: unknown | null;
  createdAt: string;
  updatedAt: string;
  uuid: string;
}

export interface UseCustomAssetsState {
  data: Asset[];
  loading: boolean;
  initialData: Asset[];
  currentAsset: Asset;
}

export type SaveCustomAssets = () => Promise<boolean>;
export type SetAssetsInitialData = (assets: Asset[]) => void;
export type GetAssetsOfType = (type: string) => Asset[];
export type AddOrUpdate = (assets: Asset) => void;
export type SelectAsset = (assets: Asset) => void;

export interface UseCustomAssetsReturn {
  (assetKey?: string): {
    data: Readonly<Ref<UseCustomAssetsState['data']>>;
    loading: Readonly<Ref<UseCustomAssetsState['loading']>>;
    initialData: Readonly<Ref<UseCustomAssetsState['initialData']>>;
    currentAsset: Readonly<Ref<UseCustomAssetsState['currentAsset']>>;
    assetsIsDirty: globalThis.ComputedRef<boolean>;
    saveCustomAssets: SaveCustomAssets;
    setInitialData: SetAssetsInitialData;
    getAssetsOfType: GetAssetsOfType;
    addOrUpdate: AddOrUpdate;
    selectAsset: SelectAsset;
  };
}
