export interface QuickAddOption {
  blockName: string;
  label: string;
  category: string;
  variationIndex: number;
  type?: 'content' | 'row';
}

export interface QuickAddProps {
  options: QuickAddOption[];
  blockUuid?: string;
}
