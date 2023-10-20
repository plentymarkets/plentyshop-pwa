export type SetInitialData = () => Promise<boolean>;

export interface UseInitialSetup {
  setInitialData: SetInitialData;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
