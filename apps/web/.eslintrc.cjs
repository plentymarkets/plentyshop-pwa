module.exports = {
  extends: ['@vue-storefront/eslint-config', '@vue-storefront/eslint-config/vue3', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.vue'],
  },
  rules: {
    complexity: 0,
    'max-lines-per-function': 'off',
    'max-statements': 'off',
    'no-undef': 'off',
    'etc/no-deprecated': 'off',
    'etc/no-internal': 'off',
    'no-secrets/no-secrets': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-keyword-prefix': ['error', { disallowedPrefixes: ['new', 'for'] }],
    'unicorn/prefer-array-some': 'off',
    'sonarjs/no-duplicate-string': 'off',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    'vue/max-len': ['warn', {
      code: 120,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreHTMLAttributeValues: true
    }],
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
  },
};
