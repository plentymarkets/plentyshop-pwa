import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

export type ParticleType = 'snow' | 'leaves' | 'blossom' | 'sunflower';

export interface ModuleOptions {
  enabled: boolean;
  flakeCount: number;
  color: string;
  particleType: ParticleType;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'four-seasons',
    configKey: 'fourSeasons',
  },
  defaults: {
    enabled: true,
    flakeCount: 60,
    // Only used when particleType is 'snow' — leaves/blossom/sunflower render
    // with their own built-in seasonal palette instead of a single flat color.
    color: '#ffffff',
    particleType: 'leaves',
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return;
    }

    // Flat keys (not a nested object) so they line up with how the shop editor's
    // useSiteSettings() reads/writes site config — see runtime/components/settings/
    // four-seasons/appearance/1.effect/ParticleType.vue for the editable side.
    nuxt.options.runtimeConfig.public.fourSeasonsParticleType = options.particleType;
    nuxt.options.runtimeConfig.public.fourSeasonsFlakeCount = options.flakeCount;
    nuxt.options.runtimeConfig.public.fourSeasonsColor = options.color;

    const resolver = createResolver(import.meta.url);
    addPlugin(resolver.resolve('./runtime/particles.client'));
  },
});
