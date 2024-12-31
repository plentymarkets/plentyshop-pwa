import withNuxt from './.nuxt/eslint.config.mjs';
import { architecture, ecma } from "@vue-storefront/eslint-config";

export default withNuxt(
  {
    ignores: ['**/__mocks__/**'],
  },
  architecture({
    maxComplexity: 10,
    maxDepth: 5,
    maxStatementsPerLine: 1,
    maxLines: 500,
    maxLinesPerFunction: 100,
    maxStatements: 15,
    maxNestedCallbacks: 3,
    maxParams: 4
  }),
  ecma({
    withImport: false,
  }),
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-html': 'off',
    }
  },
);
