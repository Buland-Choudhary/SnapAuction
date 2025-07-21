// This is now a .js file even with ESM
export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {}, // No Babel, so leave this empty
};