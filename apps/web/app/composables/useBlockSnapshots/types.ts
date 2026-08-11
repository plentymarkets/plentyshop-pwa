import type { BlockSnapshot } from '@plentymarkets/shop-api';

export type SnapshotDatePreset = 'all' | '1d' | '7d' | '30d' | 'custom';

export interface SnapshotGroup {
  label: string;
  items: BlockSnapshot[];
}

export interface UseBlockSnapshotsState {
  drawerOpen: boolean;
  snapshots: BlockSnapshot[];
  loading: boolean;
  loadingMore: boolean;
  preset: SnapshotDatePreset;
  dateFrom: string;
  dateTo: string;
  confirmingId: number | null;
  restoredSnapshotId: number | null;
  restoring: boolean;
  currentPage: number;
  lastPage: number;
}
