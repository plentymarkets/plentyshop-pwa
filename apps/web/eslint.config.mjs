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
      'arrow-parens': ['error', 'always'],
      'no-console': ['error'],
      'no-constant-binary-expression': 'off',
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      'vue/no-console': ['error'],
      'vue/no-multiple-template-root': ['off'],
      'vue/no-v-html': ['off'],
      'vue/html-self-closing': ['error', { html: { void: 'always' } }],
    }
  },
);
