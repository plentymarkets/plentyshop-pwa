export interface HeaderSettings {
  meta: {
    uuid: string;
    isGlobalTemplate?: boolean;
  };
}

export type HeaderProps = {
  content?: HeaderSettings;
};
