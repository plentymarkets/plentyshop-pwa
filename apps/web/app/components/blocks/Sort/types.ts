import type { PaddingLayout } from '~/types/blocks';

export interface SortSettings {
  selectionModeCompact: boolean;
}
export type SortContent = {
  layout: PaddingLayout;
  settings: SortSettings;
};
export interface SortFormProps {
  uuid?: string;
}
