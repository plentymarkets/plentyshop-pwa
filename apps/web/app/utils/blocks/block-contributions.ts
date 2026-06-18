import type { BlocksListContribution } from '~/composables/useBlocksList/types';

type ContributionModule = { default?: BlocksListContribution };

/**
 * Block list contributions discovered at build time from internal modules
 * (`apps/web/modules/*`) and external module packages (`node_modules/*`).
 *
 * Mirrors the discovery pattern used by `blocks-imports.ts` so that block
 * components, icons and lists stay in sync across all module sources.
 *
 * Only `.ts` files are supported. JSON contributions have been removed.
 */
const internalContributions = import.meta.glob<ContributionModule>(
  '~~/modules/*/runtime/components/blocks/**/blocks-list.ts',
  { eager: true },
);

const externalContributions = import.meta.glob<ContributionModule>(
  '/node_modules/*/runtime/components/blocks/**/blocks-list.ts',
  { eager: true },
);

const collectFromGlob = (globResult: Record<string, ContributionModule>): BlocksListContribution[] =>
  Object.entries(globResult)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, module]) => module.default)
    .filter((contribution): contribution is BlocksListContribution => Boolean(contribution));

/**
 * All block list contributions in deterministic order:
 * internal modules first (alphabetical), then external modules (alphabetical).
 *
 * Order matters for variation display order in the editor; the merge logic
 * itself only ever appends variations to existing categories — it never
 * overrides metadata of an already-defined category.
 */
export const blocksListContributions: BlocksListContribution[] = [
  ...collectFromGlob(internalContributions),
  ...collectFromGlob(externalContributions),
];
