import type { Component } from 'vue';

export type BlockLayoutResolvedRule = {
  container: boolean;
  padding: boolean;
  defaultFullWidth: boolean;
};

export type BlockLoader = () => Promise<Component>;
