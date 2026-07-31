export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Shade {
  weight: string;
  rgb: string;
}

export type TailwindPalette = Array<Shade>;
