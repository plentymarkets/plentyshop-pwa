import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'templates/**'],
  },
  {
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      'no-console': ['off'],
      'arrow-parens': ['error', 'always'],
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Architecture rules similar to web app but simpler
      complexity: ['error', 10],
      'max-depth': ['error', 4],
      'max-lines': ['error', 300],
      'max-lines-per-function': ['error', 50],
      'max-statements': ['error', 30],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['error', 4],
    },
  },
  // Relaxed rules for test files
  {
    files: ['**/__tests__/**/*.{js,ts}', '**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    rules: {
      'max-lines-per-function': ['error', 200], // Relaxed for test files
      'max-nested-callbacks': ['error', 5], // Relaxed for describe/it nesting
      'max-lines': ['error', 500], // Relaxed for test files
    },
  },
  prettier,
];
