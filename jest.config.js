module.exports = {
  roots: [
    "<rootDir>/src/"
  ],
  // Only files ending in .test.ts / .spec.ts are treated as suites — deliberately
  // not "**/__tests__/**/*", since src/__tests__/ also holds non-test helpers
  // (e.g. test-functions.ts) that Jest would otherwise try to run as empty suites.
  testMatch: [
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  // collectCoverage is left off by default so plain `npm test` / `test-watch`
  // stay fast; `npm run test:coverage` (or `jest --coverage`) turns it on.
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/__tests__/**",
    "!src/swagger.ts",
    "!src/types.d.ts",
    "!src/index.ts"
  ],
  coverageReporters: ["text", "lcov", "json-summary"],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70
    },
    "./src/type-checks.ts": {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    },
    "./src/lookup.ts": {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90
    }
  }
}
