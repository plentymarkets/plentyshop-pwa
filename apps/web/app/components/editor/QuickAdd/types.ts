export interface QuickAddOption {
  blockName: string;
  label: string;
  category: string;
  variationIndex: number;
}

export interface QuickAddProps {
  options: QuickAddOption[];
}
