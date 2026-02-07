import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Forbid console.log/debug/info in production code
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  // Allow console in test files and mocks
  {
    files: ['**/__tests__/**', '**/*.test.*', '**/test-setup.*', '**/mocks/**'],
    rules: {
      'no-console': 'off',
    },
  },
])
