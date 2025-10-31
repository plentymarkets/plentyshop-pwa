export interface SortSettings {
  selectionModeAlways: boolean;
}
export type SortContent = {
  layout: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  };
  settings: SortSettings;
};
export interface SortFormProps {
  uuid?: string;
}
