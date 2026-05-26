export type SetInitialData = () => Promise<boolean>;

export interface UseInitialSetup {
  setInitialData: SetInitialData;
  setInitialDataSSR: SetInitialData;
  fetchSettings: () => Promise<void>;
  fetchCacheableInitData: SetInitialData;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
