const path = require('path');

module.exports = {
  transform: {
    // In CI, we don't need the tests to type check, so use babel-jest
    // In non-CI (locally), use ts-jest so tests fail on type errors
    '.(ts|tsx|js|jsx)': process.env.CI ? 'babel-jest' : 'ts-jest',
  },
  // Makes jest transform monaco, but continue ignoring other node_modules. Used for MonacoUtils test
  transformIgnorePatterns: ['node_modules/(?!(monaco-editor)/)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.join(
      __dirname,
      './__mocks__/fileMock.js'
    ),
    '^monaco-editor/esm/vs/editor/editor.api.js$': path.join(
      __dirname,
      './__mocks__/monaco-editor.js'
    ),
    // Used for MonacoUtils test
    '^monaco-editor/esm/vs/editor/common/standalone/(.*)': path.join(
      __dirname,
      'node_modules',
      'monaco-editor/esm/vs/editor/common/standalone/$1'
    ),
    '^monaco-editor/esm/vs/editor/(.*)': path.join(
      __dirname,
      './__mocks__/monaco-editor-empty.js'
    ),
  },
  setupFilesAfterEnv: [path.join(__dirname, './jest.setup.js')],
};
