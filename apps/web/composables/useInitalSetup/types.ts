export type SetInitialData = () => Promise<void>;

export interface UseInitialSetup {
  setInitialData: SetInitialData;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
