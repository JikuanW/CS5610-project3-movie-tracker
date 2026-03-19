import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Allow console logs in backend files
      'no-console': 'off',

      // Allow intentionally unused args like _next
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];