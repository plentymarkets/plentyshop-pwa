import withNuxt from './.nuxt/eslint.config.mjs';
import { architecture, ecma } from "@vue-storefront/eslint-config";
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";
import { noI18nGlobals } from './eslint-rules/no-i18n-globals.js';
import { noMultipleTemplateCallbacks } from './eslint-rules/no-multiple-template-callbacks.js';
import { fileOrganizationTypes } from './eslint-rules/file-organization-types.js';
import { noBareTailwindResponsiveInContainer } from './eslint-rules/no-bare-responsive-in-container.js';
import { noNamedReexportInBarrel } from './eslint-rules/no-named-reexport-in-barrel.js';
import { enforceZIndexTokens } from './eslint-rules/enforce-z-index-tokens.js';

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
    maxNestedCallbacks: 3,
    maxParams: 4
  }),
  ecma({
    withImport: false,
  }),
  ...pluginVueA11y.configs["flat/recommended"],
  {
    plugins: {
      'custom-rules': {
        rules: {
          'no-i18n-globals': noI18nGlobals,
          'no-multiple-template-callbacks': noMultipleTemplateCallbacks,
          'file-organization-types': fileOrganizationTypes,
          'no-bare-responsive-in-container': noBareTailwindResponsiveInContainer,
          'no-named-reexport-in-barrel': noNamedReexportInBarrel,
          'enforce-z-index-tokens': enforceZIndexTokens,
        }
      }
    },
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
      'jsonc/no-useless-escape': 'off', // incompatible with ESLint 9, affects postCodeMapper.json
      'no-console': ['error'],
      'no-constant-binary-expression': 'off',
      "no-restricted-globals": [
        "error",
        {
          name: 'structuredClone',
          message: 'structuredClone strips Vue reactivity. Avoid cloning reactive state; use deepClone(...) for plain data or toRaw() on reactive objects instead.'
        }
      ],
      'no-restricted-imports': ['error', {
        patterns: [
          {
            regex: '^vue$',
            message: 'Use Nuxt auto-imports instead of importing from vue directly.',
            allowTypeImports: true
          }
        ],
        paths: [
          {
            name: '@storefront-ui/vue',
            importNames: ['SfButton'],
            message: `SfButton doesn't conform to the app's design system. Use UiButton instead.`
          },
          {
            name: '@storefront-ui/vue',
            importNames: ['SfLink'],
            message: `SfLink doesn't conform to the app's design system. Use UiLink instead.`
          }
        ]
      }],
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      'vue/no-console': ['error'],
      'vue/no-multiple-template-root': ['off'],
      'vue/no-v-html': ['off'],
      'vue/valid-v-slot': ['off'],
      'vue/html-self-closing': ['error', { html: { void: 'always' } }],
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/form-control-has-label': 'off',
      'vuejs-accessibility/label-has-for': 'off',
      'vuejs-accessibility/mouse-events-have-key-events': 'off',
      'vuejs-accessibility/no-autofocus': 'off',
      'vuejs-accessibility/no-redundant-roles': 'off',
      'vuejs-accessibility/no-static-element-interactions': 'off',
      'custom-rules/no-i18n-globals': 'error',
      'custom-rules/no-multiple-template-callbacks': 'error',
      'custom-rules/file-organization-types': 'error',
    }
  },
  {
    files: [
      'app/**/*.vue',
      'modules/**/*.vue',
    ],
    rules: {
      'custom-rules/enforce-z-index-tokens': 'error',
    },
  },
  // Everything inside app/pages/, app/layouts/, and most of app/components/ is rendered
  // inside the Tailwind @container defined in app.vue -> enforce @-prefixed container variants.
  // Excluded: editor overlay components and settings/editor panels which live outside @container.
  {
    files: [
      'app/pages/**/*.vue',
      'app/layouts/**/*.vue',
      'app/components/**/*.vue',
    ],
    ignores: [
      'app/components/SafeModeBanner/**',
      'app/components/SettingsToolbar/**',
      'app/components/SiteConfigurationDrawer/**',
      'app/components/AddBlockPopover/**',
      'app/components/ui/Toolbar/**',
      'app/components/ui/PageModal/**',
      'app/components/ui/UnlinkCategoryModal/**',
      'app/components/ui/ResetProductPageModal/**',
      'app/components/ui/Notifications/**',
      'app/components/settings/**',
      'app/components/editor/**',
      'app/components/blocks/**/*Form.vue',
    ],
    rules: {
      'custom-rules/no-bare-responsive-in-container': 'error',
    },
  },
  {
    files: ['app/composables/**/index.ts', 'app/utils/**/index.ts'],
    rules: {
      'custom-rules/no-named-reexport-in-barrel': 'error',
    },
  },
);
