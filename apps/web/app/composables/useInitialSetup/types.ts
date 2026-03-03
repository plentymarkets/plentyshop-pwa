export type SetInitialData = () => Promise<boolean>;

export interface UseInitialSetup {
  setInitialData: SetInitialData;
  setInitialDataSSR: SetInitialData;
  fetchSettings: () => Promise<void>;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
