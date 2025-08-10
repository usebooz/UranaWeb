// @ts-check

import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Base ESLint rules
      ...eslint.configs.recommended.rules,
      
      // TypeScript recommended rules
      ...tseslint.configs.recommended.rules,
      
      // Prettier integration
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // React rules
      'react/react-in-jsx-scope': 0, // Not needed in React 17+

      // TypeScript rules - strict for application code
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',

      // Warnings for complex template code
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },

  // Relaxed rules for utility files only
  {
    files: ['src/css/**/*.ts'],
    rules: {},
  }
];
