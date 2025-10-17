export interface UseItemGridHeightState {
  itemGridHeight: number;
}

export type SetItemGridHeight = (height: number) => void;

export interface UseItemGridHeight {
  itemGridHeight: Ref<UseItemGridHeightState['itemGridHeight']>;
  setItemGridHeight: SetItemGridHeight;
}

export type UseItemGridHeightReturn = (uuid: string) => UseItemGridHeight;
