export type SetInitialData = () => Promise<boolean>;

export interface UseInitialSetupState {
  ssrLocale: string;
}

export interface UseInitialSetup {
  setInitialData: SetInitialData;
  setInitialDataSSR: SetInitialData;
  ssrLocale: Ref<UseInitialSetupState['ssrLocale']>;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
