import type {
  UseCustomAssetsReturn,
  UseCustomAssetsState,
  SaveCustomAssets,
  SetAssetsInitialData,
  Asset,
  AddOrUpdate,
  GetAssetsOfType,
  SelectAsset,
} from './types';
import { v4 as uuid } from 'uuid';

/**
 * @description Composable for managing custom assets (CSS, JS, Custom Code).
 * @returns UseCustomAssetsReturn
 * @example
 * ``` ts
 * const { data, loading, addOrUpdate, saveCustomAssets } = useCustomAssets();
 * ```
 */
export const useCustomAssets: UseCustomAssetsReturn = () => {
  const state = useState<UseCustomAssetsState>('customAssets', () => ({
    data: [],
    loading: false,
    initialData: [],
    currentAsset: {} as Asset,
  }));

  const addOrUpdate: AddOrUpdate = async (asset: Asset) => {
    const uuidValue = asset.uuid || uuid();
    const existingIndex = state.value.data.findIndex((a) => a.uuid === asset.uuid);

    if (existingIndex !== -1) {
      const updated = {
        ...state.value.data[existingIndex],
        ...asset,
        uuid: uuidValue,
      };

      state.value.data[existingIndex] = updated;

      if (state.value.currentAsset?.uuid === uuidValue) {
        state.value.currentAsset = updated;
      }
    } else {
      const created = {
        ...asset,
        uuid: uuidValue,
      };

      state.value.data.push(created);
      state.value.currentAsset = created;
    }
  };

  const getAssetsOfType: GetAssetsOfType = (type: string) => {
    const currentAssets = state.value.data || [];
    const initialAssets = markRaw(JSON.parse(JSON.stringify(state.value.initialData || [])));

    const merged = [...initialAssets, ...currentAssets]
      .filter((asset) => asset.type === type)
      .reduce(
        (acc, asset) => {
          acc[asset.uuid] = asset;
          return acc;
        },
        {} as Record<string, Asset>,
      );

    const assets = Object.values(merged) as Asset[];
    return assets.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  const setInitialData: SetAssetsInitialData = (assets: Asset[]) => {
    const asset = [
      {
        id: 1,
        configId: 4,
        language: null,
        type: 'css',
        name: 'snippet 1',
        assetKey: null,
        content: '.bg { color:yellow; }',
        isActive: false,
        placement: 'head_end',
        order: 0,
        scope: null,
        attributes: null,
        uuid: '123',
        createdAt: '2025-11-24T12:03:44+01:00',
        updatedAt: '2025-11-25T10:25:57+01:00',
      },
      {
        id: 2,
        configId: 4,
        language: null,
        type: 'css',
        name: 'snippet 2',
        assetKey: null,
        content: '.bg { color:green; }',
        isActive: false,
        placement: 'head_end',
        order: 1,
        scope: null,
        attributes: null,
        uuid: '12345',
        createdAt: '2025-11-25T10:25:14+01:00',
        updatedAt: '2025-11-25T10:25:57+01:00',
      },
    ];
    state.value.initialData = asset;
  };

  const assetsIsDirty = computed(() => JSON.stringify(state.value.initialData) !== JSON.stringify(state.value.data));

  const selectAsset: SelectAsset = (asset: Asset) => {
    state.value.currentAsset = asset;
  };

  const saveCustomAssets: SaveCustomAssets = async () => {
    // try {
    //   state.value.loading = true;
    //
    //   await useSdk().plentysystems.setAssets(state.value.data);
    //
    //   state.value.initialData = { ...state.value.initialData, ...state.value.data };
    //   state.value.data = [] as Asset[];
    // } catch (error) {
    //   console.error('Error saving custom assets:', error);
    // } finally {
    //   state.value.loading = false;
    // }
    return true;
  };

  return {
    assetsIsDirty,
    saveCustomAssets,
    setInitialData,
    getAssetsOfType,
    addOrUpdate,
    selectAsset,
    ...toRefs(state.value),
  };
};
