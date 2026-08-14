// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    // swagger-v3-generated.ts / swagger-v31-generated.ts are genuine,
    // unedited json-schema-to-typescript output (see the generate:swagger-*
    // npm scripts) - never hand-edited, so never hand-linted either.
    ignores: [
      'lib/**',
      'coverage/**',
      'node_modules/**',
      'src/swagger-v3-generated.ts',
      'src/swagger-v31-generated.ts'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // This library's type-guards intentionally take `any` (they narrow an
      // unknown shape into a Swagger type), so treat this as advisory only.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // urijs is a CJS module with `export =`; `import X = require(...)` is the
      // correct way to import it with a real construct signature, not a `require()` call.
      '@typescript-eslint/no-require-imports': ['error', { allowAsImport: true }],
      curly: 'error',
      eqeqeq: ['error', 'smart'],
      radix: 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-bitwise': 'error',
      'default-case': 'error'
    }
  }
);
