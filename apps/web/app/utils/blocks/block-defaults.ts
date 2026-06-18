import type { BlocksList, BlocksListContribution } from '~/composables/useBlocksList/types';

/**
 * Built-in (in-house) block list categories shipped with the shop.
 *
 * Source files live under `app/utils/blocks/defaultblocks/*.ts`, one file per
 * category. They are bundled at build time via `import.meta.glob` — no runtime
 * fetch — so the editor has its full base list available eagerly.
 *
 * Defaults are the BASE on top of which module contributions are layered.
 * They are not contributions themselves.
 */
const defaultModules = import.meta.glob<{ default: BlocksListContribution }>('~/utils/blocks/defaultblocks/*.ts', {
  eager: true,
});

export const blocksListDefaults: BlocksList = Object.entries(defaultModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .reduce<BlocksList>((acc, [, module]) => Object.assign(acc, module.default), {});
