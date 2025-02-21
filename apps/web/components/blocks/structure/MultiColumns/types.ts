export type MultiColumnsProps = {
  name: string,
  type: string,
  content: unknown[],
  configuration: {
    columnWidths: number[],
  },
  index?: number,
};
