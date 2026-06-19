import { defineNuxtModule } from '@nuxt/kit';

/**
 * Test module that contributes the RetroMarquee block via the Vite glob in
 * `~/utils/blocks/block-contributions.ts` and `~/utils/blocks/blocks-imports.ts`.
 *
 * Pure filesystem-driven: no Nuxt registration is required for blocks to be
 * picked up — this module file only exists so the directory matches the
 * convention of sibling modules (sitemap, paypal, e2e).
 *
 * Remove this entire directory to unregister the test block.
 */
export default defineNuxtModule({
  meta: {
    name: 'test-blocks',
  },
  setup() {
    // intentionally empty
  },
});
