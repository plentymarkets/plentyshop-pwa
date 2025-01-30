export interface SliderDataItem {
  desktopImage: string;
  tabletImage: string;
  mobileImage: string;
  brightness: string;
  preTitle: string;
  mainTitle: string;
  subTitle: string;
}

export interface RecommendedProductsData {
  heading: string;
  products: unknown[];
}

export type BlockData =
  | { type: 'slider'; data: SliderDataItem[] }
  | { type: 'recommendedProducts'; data: RecommendedProductsData };

export type Blocks = {
  [key: number]: BlockData;
};
export interface UseBlocksState {
  data: Blocks;
  loading: boolean;
  initialData: Blocks;
  activeId: number;
}

export type SetActive = (id: number) => void;

export interface UseBlocks {
  data: Readonly<Ref<UseBlocksState['data']>>;
  initialData: Readonly<Ref<UseBlocksState['initialData']>>;
  activeId: Readonly<Ref<UseBlocksState['activeId']>>;
  loading: Readonly<Ref<UseBlocksState['loading']>>;
  setActive: SetActive;
}

export type UseBlocksReturn = () => UseBlocks;
