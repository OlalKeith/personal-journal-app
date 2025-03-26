const jestConfig = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",  // Use ts-jest for TypeScript files
    "^.+\\.(js|jsx)$": "babel-jest" // Keep babel-jest for JS files
  },
};

export default jestConfig;
