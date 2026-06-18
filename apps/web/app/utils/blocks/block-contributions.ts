import type { BlocksListContribution } from '~/composables/useBlocksList/types';

/**
 * Block list contributions discovered at build time from modules.
 *
 *  - Internal modules: `apps/web/modules/*`
 *  - External modules: `node_modules/*`
 *
 * Contributions are LAYERED on top of the in-house defaults loaded by
 * `block-defaults.ts`; for an existing category they append variations,
 * for a new category they add the whole category.
 *
 * Mirrors the discovery pattern used by `blocks-imports.ts`.
 */
const internalContributions = import.meta.glob<{ default?: BlocksListContribution }>(
  '~~/modules/*/runtime/components/blocks/**/blocks-list.ts',
  { eager: true },
);

const externalContributions = import.meta.glob<{ default?: BlocksListContribution }>(
  '/node_modules/*/runtime/components/blocks/**/blocks-list.ts',
  { eager: true },
);

const collectFromGlob = (globResult: Record<string, { default?: BlocksListContribution }>): BlocksListContribution[] =>
  Object.entries(globResult)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, module]) => module.default)
    .filter((contribution): contribution is BlocksListContribution => Boolean(contribution));

/** All module contributions in deterministic order: internal first, external second. */
export const blocksListContributions: BlocksListContribution[] = [
  ...collectFromGlob(internalContributions),
  ...collectFromGlob(externalContributions),
];
