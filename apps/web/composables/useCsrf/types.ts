export interface UseCsrfState {
    csrf: string | null;
}

export type SetCsrf = (csrf: string) => void;
export type SetCsrfHeader = (config: any) => any;


export interface UseCsrf {
    csrf: Readonly<Ref<UseCsrfState['csrf']>>;
    setCsrf: SetCsrf;
    setCsrfHeader: SetCsrfHeader;
  }
  
  export type UseCsrfReturn = () => UseCsrf;