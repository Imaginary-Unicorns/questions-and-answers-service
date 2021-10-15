module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base', 'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
};
