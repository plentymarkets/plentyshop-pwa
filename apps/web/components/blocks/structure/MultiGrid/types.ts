export type MultiGridProps = {
  name: string;
  type: string;
  content: unknown[];
  configuration: {
    columnWidths: number[];
  };
  index?: number;
};
