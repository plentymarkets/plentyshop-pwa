export type SetInitialData = () => Promise<boolean>;

export interface UseInitialSetupState {
  ssrLocale: string;
  loading: boolean;
}

export interface UseInitialSetup {
  setInitialData: SetInitialData;
  setInitialDataSSR: SetInitialData;
  ssrLocale: Ref<UseInitialSetupState['ssrLocale']>;
}

export type UseInitialSetupReturn = () => UseInitialSetup;
