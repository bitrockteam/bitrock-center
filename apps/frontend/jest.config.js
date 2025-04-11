/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "services/**/*.{ts,tsx}", // <-- cambia il path in base alla tua struttura
    "components/**/*.{ts,tsx}", // <-- cambia il path in base alla tua struttura
    "api/**/*.{ts,tsx}", // <-- cambia il path in base alla tua struttura
    "app/**/*.{ts,tsx}", // <-- cambia il path in base alla tua struttura
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/index.ts", // <-- escludi file "entrypoint" se necessario
  ],
  coverageReporters: ["text", "lcov", "html"],
};
