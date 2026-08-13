import type { BlockSnapshot } from '@plentymarkets/shop-api';

export const formatSnapshotDateTime = (snapshot: BlockSnapshot): string =>
  new Date(snapshot.createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const getSnapshotVersionName = (snapshot: BlockSnapshot): string =>
  snapshot.label || formatSnapshotDateTime(snapshot);
