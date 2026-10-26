import type { Component } from 'vue';

export type SettingsGroupLoader = () => Promise<Component>;

export interface ExtensionConfigModule {
  default?: { name?: string };
}
