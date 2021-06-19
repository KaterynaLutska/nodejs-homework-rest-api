module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    "jest/globals": true,
  },
  extends: ["standard", "prettier", "plugin:json/recommended"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};
