// eslint-rules/no-named-reexport-in-barrel.js
/**
 * @fileoverview Rule to enforce export-star instead of named re-exports in barrel index.ts files.
 * Named re-exports (export { X } from '...') in composable barrel files cause Nuxt auto-import
 * to register the symbol twice (once from index.ts, once from the original file), triggering
 * "Duplicated imports" warnings. Using `export *` avoids this because unimport traces the export
 * back to the original source file, preventing duplicate registration.
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noNamedReexportInBarrel = {
  meta: {
    type: 'problem',
    hasSuggestions: true,
    docs: {
      description:
        'Use `export *` instead of named re-exports in barrel index.ts files to avoid Nuxt auto-import duplicates.',
    },
    messages: {
      useExportStar:
        "Use `export * from '{{ source }}'` instead of named re-exports to avoid Nuxt auto-import duplicates.",
      useExportTypeStar:
        "Use `export type * from '{{ source }}'` instead of named type re-exports to avoid Nuxt auto-import duplicates.",
      suggestExportStar: "Replace with `export * from '{{ source }}'`",
      suggestExportTypeStar: "Replace with `export type * from '{{ source }}'`",
    },
    schema: [],
  },

  create(context) {
    return {
      ExportNamedDeclaration(node) {
        if (!node.source || node.specifiers.length === 0) return;

        const isTypeOnly = node.exportKind === 'type' || node.specifiers.every((s) => s.exportKind === 'type');
        const source = node.source.value;
        const hasAlias = node.specifiers.some((s) => s.local.name !== s.exported.name);
        const hasDefault = node.specifiers.some((s) => s.local.name === 'default');
        const hasMixedKinds =
          node.specifiers.some((s) => s.exportKind === 'type') && node.specifiers.some((s) => s.exportKind !== 'type');
        const isSafeToSuggest = !hasAlias && !hasDefault && !hasMixedKinds;

        const report = {
          node,
          messageId: isTypeOnly ? 'useExportTypeStar' : 'useExportStar',
          data: { source },
        };

        if (isSafeToSuggest) {
          report.suggest = [
            {
              messageId: isTypeOnly ? 'suggestExportTypeStar' : 'suggestExportStar',
              data: { source },
              fix(fixer) {
                const prefix = isTypeOnly ? 'export type *' : 'export *';
                return fixer.replaceText(node, `${prefix} from '${source}';`);
              },
            },
          ];
        }

        context.report(report);
      },
    };
  },
};

export default noNamedReexportInBarrel;
