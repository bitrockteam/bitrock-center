/** @type {import('jest').Config} */

import dotenv from "dotenv";

dotenv.config({ path: ".env" });

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { configFile: "./test/babel.config.js" }],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/app/\\(auth\\)/(.*)$": "<rootDir>/app/(auth)/$1",
    "^@/app/\\(config\\)/(.*)$": "<rootDir>/app/(config)/$1",
    "^@/config$": "<rootDir>/config",
    "^@/config/(.*)$": "<rootDir>/config/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
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
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
};
