import type { BaseColors, Languages } from './types';

export class SystemConfiguration {
  private readonly environment: Record<string, string | undefined>;

  constructor(env: Record<string, string | undefined>) {
    this.environment = env;
  }

  getBaseColors(): BaseColors {
    return {
      primary: this.environment.NUXT_PUBLIC_PRIMARY_COLOR || '#0c7992',
      secondary: this.environment.NUXT_PUBLIC_SECONDARY_COLOR || '#31687d',
    };
  }

  getFaviconUrl(): string {
    return this.environment.FAVICON || '';
  }

  getLogoUrl(): string {
    return this.environment.LOGO || '';
  }

  getLanguages(): Languages {
    return {
      default: this.environment.DEFAULTLANGUAGE || 'en',
      activated: this.environment.LANGUAGELIST || 'en,de',
    };
  }
}
