export type SetInitialData = () => void;

export interface UseInitialSetup {
  setInitialData: SetInitialData;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
