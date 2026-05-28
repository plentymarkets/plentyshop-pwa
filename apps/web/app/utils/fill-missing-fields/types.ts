export type PlainObject = Record<string, unknown>;
export type TreatAsEmpty = (path: string, value: unknown) => boolean;

export type MergeContext = {
  forced: Set<string>;
  ignored: Set<string>;
  path: string;
  treatAsEmpty?: TreatAsEmpty;
};

export type FillMissingFieldsOptions = {
  forcedKeys?: ReadonlyArray<string> | ReadonlySet<string>;
  ignoredKeys?: ReadonlyArray<string> | ReadonlySet<string>;
  treatAsEmpty?: TreatAsEmpty;
};
