import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, addComponent } from '@nuxt/kit';

export type ParticleType = 'snow' | 'leaves' | 'blossom' | 'sunflower';

export interface ModuleOptions {
  enabled: boolean;
  flakeCount: number;
  particleType: ParticleType;
}

export const DEFAULT_FLAKE_COUNT = 60;
export const MIN_FLAKE_COUNT = 0;
export const MAX_FLAKE_COUNT = 500;

export const clampFlakeCount = (flakeCount: number): number => {
  if (!Number.isFinite(flakeCount)) {
    return DEFAULT_FLAKE_COUNT;
  }

  return Math.min(MAX_FLAKE_COUNT, Math.max(MIN_FLAKE_COUNT, Math.trunc(flakeCount)));
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'four-seasons',
    configKey: 'plentymarketsFourSeasons',
  },
  defaults: {
    enabled: true,
    flakeCount: 60,
    particleType: 'leaves',
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return;
    }

    nuxt.options.runtimeConfig.public.fourSeasonsEnabled = options.enabled;
    nuxt.options.runtimeConfig.public.fourSeasonsParticleType = options.particleType;
    nuxt.options.runtimeConfig.public.fourSeasonsFlakeCount = clampFlakeCount(options.flakeCount);

    const resolver = createResolver(import.meta.url);
    addPlugin(resolver.resolve('./runtime/plugins/particles.client'));
    addComponentsDir({path: resolver.resolve('./runtime/components')});
  },
});
