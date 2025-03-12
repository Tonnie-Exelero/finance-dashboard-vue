module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // Integrates Prettier with ESLint
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // Vue rules
    "vue/multi-word-component-names": "off",
    "vue/max-attributes-per-line": ["warn", { singleline: 3 }],
    "vue/html-self-closing": ["warn", { html: { normal: "always" } }],

    // General ESLint rules
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    // Prettier
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};
