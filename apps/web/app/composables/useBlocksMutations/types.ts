export interface UseBlocksMutations {
  insertColumnUuid: Ref<string | null>;
  setInsertColumnUuid: (uuid: string) => void;
  clearInsertColumnUuid: () => void;
}

export type UseBlocksMutationsReturn = () => UseBlocksMutations;
