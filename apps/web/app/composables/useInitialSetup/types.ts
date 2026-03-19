export type SetInitialData = () => Promise<boolean>;

export interface UseInitialSetup {
  setInitialData: SetInitialData;
  setInitialDataSSR: SetInitialData;
  fetchSettings: () => Promise<void>;
  fetchCachableInitData: SetInitialData;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
