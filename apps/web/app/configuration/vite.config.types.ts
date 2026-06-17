export type BlockSource = 'core' | 'module' | 'customer';

export type BlockFile = {
  path: string;
  name: string;
  source: BlockSource;
  origin: string;
};

export type ModuleFile = {
  path: string;
  module: string;
};
