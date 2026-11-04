const customerOverridesRoot = import.meta.glob('/node_modules/*/runtime/utils/blockTemplates/*.ts', {
  eager: true,
}) as Record<string, BlockTemplateOverrideModule>;

const customerOverridesWorkspace = import.meta.glob(
  '@workspace/node_modules/{*,@*/*}/{,*/}runtime/utils/blockTemplates/*.ts',
  { eager: true },
) as Record<string, BlockTemplateOverrideModule>;

const nuxtModuleOverrides = import.meta.glob('~~/modules/*/runtime/utils/blockTemplates/*.ts', {
  eager: true,
}) as Record<string, BlockTemplateOverrideModule>;

const kindOf = (path: string) => path.split('/').pop()?.replace(/\.ts$/, '');

/**
 * Merges override files into a kind → factory map. Sources are applied in order, so later sources win.
 * Files with an unknown name or without a default export are ignored.
 */
export const collectBlockTemplateOverrides = (
  sources: Record<string, BlockTemplateOverrideModule>[],
): BlockTemplateOverrides => {
  const overrides: Record<string, unknown> = {};

  sources.forEach((source) => {
    Object.entries(source).forEach(([path, mod]) => {
      const kind = kindOf(path);
      if (kind && (BLOCK_TEMPLATE_KINDS as readonly string[]).includes(kind) && typeof mod.default === 'function') {
        overrides[kind] = mod.default;
      }
    });
  });

  return overrides as BlockTemplateOverrides;
};

const blockTemplateOverrides = collectBlockTemplateOverrides([
  nuxtModuleOverrides,
  customerOverridesRoot,
  customerOverridesWorkspace,
]);

/**
 * Returns the module/customer override for a template kind, or the given core factory when none exists.
 */
export const resolveBlockTemplate = <K extends BlockTemplateKind>(
  kind: K,
  coreFactory: BlockTemplateFactories[K],
  overrides: BlockTemplateOverrides = blockTemplateOverrides,
): BlockTemplateFactories[K] => (overrides[kind] as BlockTemplateFactories[K] | undefined) ?? coreFactory;
