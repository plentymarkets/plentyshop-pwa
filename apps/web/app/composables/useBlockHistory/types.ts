export interface UseBlockHistory {
  canUndo: Readonly<Ref<boolean>>;
  canRedo: Readonly<Ref<boolean>>;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
}

export type UseBlockHistoryReturn = () => UseBlockHistory;
