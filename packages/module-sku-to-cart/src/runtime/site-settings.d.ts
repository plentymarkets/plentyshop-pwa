// `useSiteSettings` is provided by the shop (auto-imported in the shop app), so it is declared here for type checking.
declare module '#imports' {
  export function useSiteSettings(setting?: string): {
    getSetting: () => string;
    updateSetting: (value: string) => void;
  };
}

export {};
