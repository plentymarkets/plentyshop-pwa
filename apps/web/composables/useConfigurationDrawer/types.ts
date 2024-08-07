import { TailwindPalette } from '~/utils/tailwindHelper';

export type SetColorProperties = (type: string, tailwindPalette: TailwindPalette) => void;
export type UpdateColorPalette = (hexColor: string) => void;

export interface UseConfigurationDrawerMethods {
  open: Readonly<Ref<boolean>>;
  updatePrimaryColor: UpdateColorPalette;
  updateSecondaryColor: UpdateColorPalette;
}

export type UseConfigurationDraerMethodsReturn = () => UseConfigurationDrawerMethods;
