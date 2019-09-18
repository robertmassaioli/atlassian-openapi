module.exports = {
  roots: [
    "<rootDir>/src/"
  ],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
}