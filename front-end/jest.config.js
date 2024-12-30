module.exports = {
  // Jest configuration options
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform .js and .jsx files using babel-jest
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@react-chess/chessground|swiper)/)",
    '\\.pnp\\.[^\\/]+$',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js', // Mock file imports
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js', // Mock CSS imports
  },
};
