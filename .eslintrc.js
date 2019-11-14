module.exports = {
  parser: 'babel-eslint',
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-undef': 2,
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    fetch: 'readonly',
    chrome: 'readonly',
    window: 'readonly',
    document: 'readonly',
    DOMParser: 'readonly',
    __DEV__: 'readonly'
    page: true,
    browser: true,
    context: true,
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
