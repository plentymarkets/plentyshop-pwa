export interface PerPageSettings {
  selectionModeCompact: boolean;
}
export type PerPageContent = {
  layout: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  };
  settings: PerPageSettings;
};
export interface PerPageProps {
  uuid?: string;
}
