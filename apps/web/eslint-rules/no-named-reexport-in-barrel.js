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
    fixable: 'code',
    docs: {
      description:
        'Use `export *` instead of named re-exports in barrel index.ts files to avoid Nuxt auto-import duplicates.',
    },
    messages: {
      useExportStar:
        "Use `export * from '{{ source }}'` instead of named re-exports to avoid Nuxt auto-import duplicates.",
    },
    schema: [],
  },

  create(context) {
    return {
      ExportNamedDeclaration(node) {
        if (node.source && node.specifiers.length > 0) {
          const isSafeToFix = node.specifiers.every(
            (s) => s.local.name === s.exported.name && s.local.name !== 'default',
          );

          context.report({
            node,
            messageId: 'useExportStar',
            data: { source: node.source.value },
            ...(isSafeToFix && {
              fix(fixer) {
                return fixer.replaceText(node, `export * from '${node.source.value}';`);
              },
            }),
          });
        }
      },
    };
  },
};
