import withNuxt from './.nuxt/eslint.config.mjs';
import { architecture, ecma } from "@vue-storefront/eslint-config";

export default withNuxt(
  {
    ignores: ['**/__mocks__/**'],
  },
  architecture({
    maxComplexity: 100, // target: 10
    maxDepth: 5,
    maxStatementsPerLine: 1,
    maxLines: 500,
    maxLinesPerFunction: 1000, // target: 100
    maxStatements: 150, // target: 15
    maxNestedCallbacks: 30, // target: 3
    maxParams: 4
  }),
  ecma({
    withImport: false,
  }),
  {
    /**
     * Rules from other plugins
     * Consider reintroducing in the future
     * 
     * etc/no-implicit-any-catch
     * etc/throw-error
     * promise/no-nesting
     * sonarjs/cognitive-complexity
     * sonarjs/no-identical-functions
     * unicorn/consistent-function-scoping
     * unicorn/expiring-todo-comments
     * unicorn/no-thenable
     * unicorn/prefer-add-event-listener
     */
    rules: {
      'arrow-parens': 'off',
      'no-console': 'off',
      'no-constant-binary-expression': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/no-export-in-script-setup': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-html': 'off',
      'vue/html-self-closing': 'off',
    }
  },
);
