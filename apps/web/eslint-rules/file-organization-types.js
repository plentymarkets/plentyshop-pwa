/**
 * @fileoverview Rule to enforce that all TypeScript types and interfaces must be in files named 'types.ts'
 * and that 'types.ts' files can only contain type and interface declarations, while their imports are limited
 * to external modules or internal enum files.
 * @author Adapted from https://github.com/Factory-AI/eslint-plugin/blob/main/rules/types-file-organization/index.js
 */

/** @type {import('eslint').Rule.RuleModule} */
export const fileOrganizationTypes = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce TypeScript types and interfaces organization',
      category: 'TypeScript',
      recommended: true,
    },
    messages: {
      typeInWrongFile:
        'TypeScript types and interfaces must be defined in a file named "types.ts"',
      nonTypeInTypeFile:
        'Files named "types.ts" can only contain type aliases and interface declarations',
      invalidImportInTypeFile:
        'Files named "types.ts" can only import external modules or enum files',
    },
    schema: [], // no options supported
  },

  create(context) {
    const filename = context.getFilename();
    const isDeclarationFile = filename.endsWith('.d.ts');
    const isTestFile = filename.includes('/__tests__/') || filename.includes('\\__tests__\\');
    const isTypeFile =
      !isDeclarationFile &&
      (filename.endsWith('/types.ts') ||
        filename === 'types.ts' ||
        filename.endsWith('.types.ts'));

    // Check whether an import is allowed in types files
    function isValidImportForTypeFile(importPath) {
      // External module imports (not relative or internal)
      const isExternal =
        !importPath.startsWith('.') &&
        !importPath.startsWith('/') &&
        !importPath.startsWith('@/');

      if (isExternal) {
        return true;
      }

      // Allow internal enum/type/schema files
      return (
        importPath.endsWith('/enums') ||
        importPath.endsWith('/enums.ts') ||
        importPath === 'enums' ||
        importPath.endsWith('/types') ||
        importPath.endsWith('/types.ts') ||
        importPath === 'types' ||
        importPath.endsWith('/schema') ||
        importPath.endsWith('/schema.ts') ||
        importPath === 'schema'
      );
    }

    return {
      // Flag all type aliases outside types.ts
      TSTypeAliasDeclaration(node) {
        if (!isTypeFile && !isDeclarationFile && !isTestFile) {
          context.report({
            node,
            messageId: 'typeInWrongFile',
          });
        }
      },

      // Flag all interfaces outside types.ts
      TSInterfaceDeclaration(node) {
        if (!isTypeFile && !isDeclarationFile && !isTestFile) {
          // Allow interfaces inside `declare module` augmentation blocks
          if (node.parent && node.parent.type === 'TSModuleBlock') {
            return;
          }
          context.report({
            node,
            messageId: 'typeInWrongFile',
          });
        }
      },

      // Validate imports in types.ts
      ImportDeclaration(node) {
        if (
          isTypeFile &&
          node.source &&
          node.source.value &&
          node.importKind !== 'type'
        ) {
          const importPath = node.source.value;
          if (!isValidImportForTypeFile(importPath)) {
            context.report({
              node,
              messageId: 'invalidImportInTypeFile',
            });
          }
        }
      },

      // Disallow non-type declarations in types.ts
      Program(node) {
        if (isTypeFile) {
          // Only process types.ts files
          for (const statement of node.body) {
            // Allow type aliases, interfaces, and type exports
            const isTypeAlias =
              statement.type === 'TSTypeAliasDeclaration' ||
              (statement.type === 'ExportNamedDeclaration' &&
                statement.declaration &&
                statement.declaration.type === 'TSTypeAliasDeclaration');

            const isInterface =
              statement.type === 'TSInterfaceDeclaration' ||
              (statement.type === 'ExportNamedDeclaration' &&
                statement.declaration &&
                statement.declaration.type === 'TSInterfaceDeclaration');

            // Allow export statements that export types
            const isExportingTypes =
              statement.type === 'ExportNamedDeclaration' &&
              (statement.declaration === null ||
                statement.declaration.type === 'TSTypeAliasDeclaration' ||
                statement.declaration.type === 'TSInterfaceDeclaration');

            // Allow re-exports from the current file
            const isReExportFromCurrentFile =
              statement.type === 'ExportNamedDeclaration' &&
              !statement.source &&
              statement.specifiers &&
              statement.specifiers.length > 0;

            // Export-all declarations are not allowed
            const isExportAllDeclaration =
              statement.type === 'ExportAllDeclaration';

            // Allow import declarations from enum/type/schema files (checked separately)
            const isImport = statement.type === 'ImportDeclaration';

            if (
              !(
                isTypeAlias ||
                isInterface ||
                isExportingTypes ||
                isReExportFromCurrentFile ||
                isImport
              ) &&
              !isExportAllDeclaration
            ) {
              // Skip export-all declarations (handled by ImportDeclaration)
              context.report({
                node: statement,
                messageId: 'nonTypeInTypeFile',
              });
            }
          }
        }
      },
    };
  },
};
