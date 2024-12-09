import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import withNuxt from './.nuxt/eslint.config.mjs';
import { ecma, typescript, architecture } from "@vue-storefront/eslint-config";
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default withNuxt(
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.vue'],
      }
    },
    rules: {
      complexity: 0,
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-undef': 'off',
      'no-restricted-imports': [
        'error',
        {
          'paths': [{
            name: '@storefront-ui/vue',
            importNames: ['SfButton'],
            message: `SfButton doesn't conform to the app's design system. Use UiButton instead.`
          }],
        },
      ],
      'etc/no-deprecated': 'off',
      'etc/no-internal': 'off',
      'no-secrets/no-secrets': 'off',
      'unicorn/filename-case': 'off',
      // 'unicorn/no-keyword-prefix': ['error', { disallowedPrefixes: ['new', 'for'] }],
      'unicorn/prefer-array-some': 'off',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/ban-ts-comment': 'off',
      'vue/component-tags-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      // 'vue/max-len': ['warn', {
      //   code: 120,
      //   ignoreStrings: true,
      //   ignoreUrls: true,
      //   ignoreTemplateLiterals: true,
      //   ignoreHTMLAttributeValues: true
      // }],
      'vue/multi-word-component-names': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
  ...pluginVue.configs['flat/recommended'],
  tseslint.configs.recommended,
  ecma(),
  typescript(),
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
);
