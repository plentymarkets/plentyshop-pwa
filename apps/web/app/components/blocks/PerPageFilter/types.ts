import type { PaddingLayout } from '~/types/blocks';

export interface PerPageSettings {
  selectionModeCompact: boolean;
}
export type PerPageContent = {
  layout: PaddingLayout;
  settings: PerPageSettings;
};
export interface PerPageProps {
  uuid?: string;
}
