import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**',
    '**/blob-report/**',
    '**/playwright/.cache/**',
    '**/.vite/**',
    'work/**',
    '.agents/**',
    '.specify/**',
  ]),
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.vue'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  vue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: ['.vue'],
      },
    },
  },
])
